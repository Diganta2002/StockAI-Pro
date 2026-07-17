import jwt
import random
import hashlib
import secrets
import requests
import xml.etree.ElementTree as ET
from fastapi import FastAPI, Query, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta

from app.database import get_db_connection, init_db
from app.amfi_fetcher import fetch_amfi_nav
from app.ai_advisor import analyze_fund_risk, analyze_news_impact

app = FastAPI(
    title="AI Mutual Fund Analyzer Backend API",
    description="Full-stack database auth system, AMFI scraper, and Gemini-based Hinglish investment/news analyzer."
)

# Startup DB Initialization
@app.on_event("startup")
def startup_event():
    init_db()

# CORS Middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Configurations
SECRET_KEY = "AI_MUTUAL_FUND_ANALYZER_SECRET_KEY"
ALGORITHM = "HS256"

# Request Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRiskProfile(BaseModel):
    age: int
    investment_horizon: str
    risk_tolerance: str

class RiskAnalysisRequest(BaseModel):
    fund_data: Dict[str, Any]
    user_profile: UserRiskProfile

class BuyRequest(BaseModel):
    fund_id: str
    fund_name: str
    amount: float
    purchase_nav: float
    category: str
    return3Y: str

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# Helper Authentication functions
def get_password_hash(password: str) -> str:
    # PBKDF2 style salted hashing
    salt = secrets.token_hex(16)
    hash_obj = hashlib.sha256((salt + password).encode())
    hashed = hash_obj.hexdigest()
    return f"{salt}:{hashed}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt, hashed = hashed_password.split(":")
        hash_obj = hashlib.sha256((salt + plain_password).encode())
        return hash_obj.hexdigest() == hashed
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user_id(authorization: Optional[str] = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing.")
    
    try:
        # Expected header format: "Bearer <token>"
        token = authorization.split(" ")[1] if " " in authorization else authorization
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authorization payload.")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Session expired or invalid token. Please login again.")

# --- ROUTES ---

@app.get("/")
def health():
    return {"status": "active", "db": "SQLite connected"}

# 1. AUTHENTICATION ROUTERS
@app.post("/api/auth/register")
def register(user: UserRegister):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="This email is already registered.")
        
    hashed_pwd = get_password_hash(user.password)
    try:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (user.name, user.email, hashed_pwd)
        )
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"Database registration error: {e}")
        
    conn.close()
    return {"status": "success", "message": "Account created successfully. You can now login!"}

@app.post("/api/auth/login")
def login(credentials: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, email, password_hash FROM users WHERE email = ?", (credentials.email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
        
    token = create_access_token({"user_id": user["id"], "email": user["email"]})
    return {
        "status": "success",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }

# Simulated OTP storage
TEMP_OTPS = {}

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (req.email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=444, detail="Email is not registered.")
        
    # Generate random 6 digit OTP
    otp_code = str(random.randint(100000, 999999))
    TEMP_OTPS[req.email] = otp_code
    print(f"\n========================================\n[SIMULATED OTP SENT TO {req.email}]: {otp_code}\n========================================\n")
    return {"status": "success", "message": "OTP has been simulated. Check your uvicorn console or use the returned code.", "otp": otp_code}

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    if req.email not in TEMP_OTPS or TEMP_OTPS[req.email] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    hashed_pwd = get_password_hash(req.new_password)
    cursor.execute("UPDATE users SET password_hash = ? WHERE email = ?", (hashed_pwd, req.email))
    conn.commit()
    conn.close()
    
    # Remove verified OTP
    del TEMP_OTPS[req.email]
    return {"status": "success", "message": "Password reset successfully! You can now log in."}


# 2. EXPLORER INDICES & FUNDS
@app.get("/api/indices")
def get_indices():
    STOCK_INDICES = [
      {"name": "NIFTY BANK", "value": "48,125.40", "change": "-0.3%", "up": False},
      {"name": "GOLD", "value": "72,400.00", "change": "+2.1%", "up": True},
      {"name": "USD/INR", "value": "83.45", "change": "-0.1%", "up": False},
      {"name": "NASDAQ", "value": "16,215.10", "change": "+1.5%", "up": True},
      {"name": "NIFTY 50", "value": "22,453.30", "change": "+1.2%", "up": True},
      {"name": "SENSEX", "value": "74,012.15", "change": "+0.8%", "up": True},
      {"name": "NIFTY IT", "value": "38,150.20", "change": "-0.5%", "up": False},
      {"name": "CRUDE OIL", "value": "81.25", "change": "+1.8%", "up": True}
    ]
    return STOCK_INDICES

@app.get("/api/funds")
def get_funds(
    category: Optional[str] = Query("All"),
    search: Optional[str] = Query("")
):
    funds = fetch_amfi_nav()
    filtered = []
    for f in funds:
        if category != "All" and f["category"] != category:
            continue
        if search and search.lower() not in f["name"].lower() and search.lower() not in f["type"].lower():
            continue
        filtered.append(f)
    return filtered

# 3. AI RISK EVALUATION
@app.post("/api/analyze-risk")
def analyze_risk(request: RiskAnalysisRequest, user_id: int = Depends(get_current_user_id)):
    """Locked behind session authentication, returns advisory report in Hinglish."""
    return analyze_fund_risk(request.fund_data, {
        "age": request.user_profile.age,
        "investment_horizon": request.user_profile.investment_horizon,
        "risk_tolerance": request.user_profile.risk_tolerance
    })

# 4. DATABASE USER PORTFOLIO ROUTES
@app.get("/api/portfolio")
def get_portfolio(user_id: int = Depends(get_current_user_id)):
    """Fetch user portfolio, automatically re-calculating values using live NAVs from AMFI!"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, fund_id, fund_name, units, invested_value, purchase_nav, category, return3Y 
        FROM portfolios WHERE user_id = ?
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()
    
    # Fetch live NAVs to calculate current value and profit/loss
    live_funds = fetch_amfi_nav()
    nav_map = {f["id"]: float(f["nav"]) for f in live_funds}
    
    portfolio_list = []
    for r in rows:
        fund_id = r["fund_id"]
        # Use live NAV if available, else fallback to purchase NAV
        current_nav = nav_map.get(fund_id, r["purchase_nav"])
        current_value = r["units"] * current_nav
        pnl = current_value - r["invested_value"]
        pnl_percent = (pnl / r["invested_value"] * 100) if r["invested_value"] > 0 else 0
        
        portfolio_list.append({
            "id": r["id"],
            "fund_id": fund_id,
            "fund_name": r["fund_name"],
            "units": round(r["units"], 4),
            "invested_value": round(r["invested_value"], 2),
            "purchase_nav": r["purchase_nav"],
            "current_nav": current_nav,
            "current_value": round(current_value, 2),
            "pnl": round(pnl, 2),
            "pnl_percent": round(pnl_percent, 2),
            "category": r["category"],
            "return3Y": r["return3Y"]
        })
        
    return portfolio_list

@app.post("/api/portfolio/buy")
def buy_fund(purchase: BuyRequest, user_id: int = Depends(get_current_user_id)):
    """Buy/purchase units and store them in the user specific SQLite portfolio."""
    if purchase.amount <= 0 or purchase.purchase_nav <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount or NAV price.")
        
    units_bought = purchase.amount / purchase.purchase_nav
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if the user already holds this mutual fund
    cursor.execute(
        "SELECT id, units, invested_value FROM portfolios WHERE user_id = ? AND fund_id = ?",
        (user_id, purchase.fund_id)
    )
    existing = cursor.fetchone()
    
    if existing:
        new_units = existing["units"] + units_bought
        new_invested = existing["invested_value"] + purchase.amount
        # Weighted average purchase NAV
        new_avg_nav = new_invested / new_units
        
        cursor.execute("""
            UPDATE portfolios 
            SET units = ?, invested_value = ?, purchase_nav = ? 
            WHERE id = ?
        """, (new_units, new_invested, new_avg_nav, existing["id"]))
    else:
        cursor.execute("""
            INSERT INTO portfolios (user_id, fund_id, fund_name, units, invested_value, purchase_nav, category, return3Y)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id, purchase.fund_id, purchase.fund_name, 
            units_bought, purchase.amount, purchase.purchase_nav, 
            purchase.category, purchase.return3Y
        ))
        
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Successfully invested {purchase.amount} into {purchase.fund_name}!"}

@app.delete("/api/portfolio/sell/{holding_id}")
def sell_fund(holding_id: int, user_id: int = Depends(get_current_user_id)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verify holding belongs to logged-in user
    cursor.execute("SELECT id FROM portfolios WHERE id = ? AND user_id = ?", (holding_id, user_id))
    holding = cursor.fetchone()
    
    if not holding:
        conn.close()
        raise HTTPException(status_code=404, detail="Holding record not found or unauthorized.")
        
    cursor.execute("DELETE FROM portfolios WHERE id = ?", (holding_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Holding sold successfully."}

def sync_live_news():
    rss_url = "https://news.google.com/rss/search?q=mutual+funds+india&hl=en-IN&gl=IN&ceid=IN:en"
    try:
        res = requests.get(rss_url, timeout=5)
        if res.status_code == 200:
            root = ET.fromstring(res.content)
            conn = get_db_connection()
            cursor = conn.cursor()
            
            for item in root.findall(".//item")[:12]:
                title = item.find("title").text if item.find("title") is not None else "Financial News Update"
                title = title.split(" - ")[0] if " - " in title else title
                link = item.find("link").text if item.find("link") is not None else ""
                pub_date = item.find("pubDate").text if item.find("pubDate") is not None else "Today"
                
                cursor.execute("SELECT id FROM news WHERE title = ?", (title,))
                if cursor.fetchone():
                    continue
                
                content = f"Real-time market tracking. Live article links: {link}"
                category = "Mutual Funds"
                
                if pub_date and " " in pub_date:
                    try:
                        parts = pub_date.split(" ")
                        pub_date = f"{parts[1]} {parts[2]} {parts[3]}"
                    except:
                        pass
                
                cursor.execute(
                    "INSERT INTO news (title, content, category, published_at) VALUES (?, ?, ?, ?)",
                    (title, content, category, pub_date)
                )
            
            conn.commit()
            conn.close()
    except Exception as e:
        print(f"Error syncing RSS Google News: {e}")

# 5. MARKET NEWS & AI SIGNAL RECOMMENDATIONS
@app.get("/api/news")
def get_news(user_id: int = Depends(get_current_user_id)):
    """Fetch live and seeded market news updates."""
    sync_live_news()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, content, category, published_at FROM news ORDER BY id DESC LIMIT 15")
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(r) for r in rows]

@app.post("/api/news/{news_id}/analyze")
def analyze_news(news_id: int, user_id: int = Depends(get_current_user_id)):
    """Triggers Gemini to read market news and recommend matching funds, in Hinglish."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT title, content, category FROM news WHERE id = ?", (news_id,))
    article = cursor.fetchone()
    conn.close()
    
    if not article:
        raise HTTPException(status_code=404, detail="News article not found.")
        
    # Get live funds from AMFI to supply context for recommendations
    funds_pool = fetch_amfi_nav()
    
    # Run analysis
    report = analyze_news_impact(
        article["title"],
        article["content"],
        article["category"],
        funds_pool
    )
    return report

@app.post("/api/chat")
def chat_ai(request: ChatRequest, user_id: int = Depends(get_current_user_id)):
    user_msg = request.message.lower().strip()
    
    # Simple keyword-based local financial AI responder in Hinglish
    response_text = "Mujhe aapka query mil gaya hai. Kripya mutual funds, investment duration (horizon), ya market risk ke baare mein specific pucho taaki main sahi advice de sakun!"
    
    if "sip" in user_msg or "systematic" in user_msg:
        response_text = "SIP (Systematic Investment Plan) start karna wealth creation ke liye sabse best option hai. Isme aap har mahine chota amount (jaise Rs. 500 ya 1000) automatic invest kar sakte ho, jisse rupee cost averaging aur compounding ka benefit milta hai. Aap hamara 'SIP Calculator' use karke details simulate kar sakte ho!"
    elif "small cap" in user_msg or "smallcap" in user_msg:
        response_text = "Small Cap funds un companies mein invest karte hain jo growth stage mein hain. Inme returns bohot high ho sakte hain (3Y CAGR > 30% tak), lekin inme risk bhi 'Very High' hota hai. Agar aapka time horizon 5-7 saal se zyada hai, tabhi small cap mein invest karein."
    elif "mid cap" in user_msg or "midcap" in user_msg:
        response_text = "Mid Cap funds moderately established companies mein invest karte hain. Yeh large cap se zyada return aur small cap se kam volatility dete hain. 3 se 5 saal ke investment horizon ke liye yeh balanced aur badhiya option hote hain."
    elif "large cap" in user_msg or "largecap" in user_msg or "bluechip" in user_msg:
        response_text = "Large Cap/Bluechip funds desh ki top 100 companies mein invest karte hain. Yeh stable, low-to-moderate risk wale funds hain. Agar aapko safe growth chahiye aur portfolio safe rakhna hai, toh Large Cap index funds best choice hain."
    elif "debt" in user_msg or "bond" in user_msg or "liquid" in user_msg:
        response_text = "Debt funds fixed income securities aur corporate bonds mein invest karte hain. Inme risk bohot kam hota hai aur safe stable returns milte hain. Agar aap 1-3 saal ke liye invest karna chahte hain toh short term debt ya liquid funds sahi rahenge."
    elif "hybrid" in user_msg or "balanced" in user_msg:
        response_text = "Hybrid funds equity (shares) aur debt (bonds) dono ka mixture hote hain. Yeh automatic asset allocation maintain karte hain. Moderate risk profiles aur 3+ years horizon ke liye yeh best hybrid balance dete hain."
    elif "risk" in user_msg or "khatra" in user_msg:
        response_text = "Mutual funds mein investment market risk ke under aata hai. High return funds (jaise small cap) mein high risk hota hai, jabki debt aur arbitrage funds mein low risk hota hai. Aap fund cards par click karke 'AI Suitability' check kar sakte hain jo aapke profile ke hisab se bata dega ki risk lena chahiye ya nahi!"
    elif "hello" in user_msg or "hi" in user_msg or "namaste" in user_msg or "helo" in user_msg:
        response_text = "Namaste! Main aapka AI Financial Advisor is project mein hoon. Mujhse investment, SIP, mutual fund risk, large/mid/small cap allocation, ya market returns ke baare mein kuch bhi pucho, main simple Hinglish mein madad karunga!"
        
    return {"response": response_text}
