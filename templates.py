# templates.py
# Large multilingual template bank + CSV helper functions (no pandas).
# Place this file in the same folder as Final_Dataset_2.csv

import csv
import random
import os
from ml_connector import predict_yield

# ------------------ TEMPLATES ------------------
# ~216 templates: irrigation, fertilizer, pest, sowing, yield, rainfall
# Languages: en, hi, mr

TEMPLATES = {
    "irrigation": {
        "en": [
            "For {crop} in {district}, irrigate lightly during {season} if rainfall is {rainfall}.",
            "{district}: Keep soil moisture for {crop} balanced. In {season}, reduce irrigation if rains are {rainfall}.",
            "Ensure {soil} soil for {crop} in {district} is moist but not waterlogged during {season}.",
            "Farmers in {district}: {crop} requires irrigation every 7 days in {season} unless rainfall is high ({rainfall}).",
            "Advice for {crop} in {district}: Irrigate at dawn or dusk in {season} to conserve water.",
            "Maintain consistent soil moisture for {crop}. Adjust irrigation in {district} when rainfall = {rainfall}.",
            "Optimal irrigation schedule for {crop}: Use drip irrigation in {district} during dry {season}.",
            "Do not irrigate {crop} in {district} during {season} if rainfall exceeds {rainfall}.",
            "In {district}, adopt alternate furrow irrigation for {crop} during {season}.",
            "Use soil moisture sensors in {district} for {crop} to decide irrigation frequency in {season}.",
            "Rainfed {crop} in {district} may not require irrigation if expected rainfall = {rainfall}.",
            "Conserve water in {district}. For {crop}, schedule irrigation only if soil dryness is observed in {season}."
        ],
        "hi": [
            "{district} जिले में {crop} के लिए {season} में वर्षा {rainfall} हो तो हल्की सिंचाई करें।",
            "{crop} के लिए {district} में मिट्टी {soil} बनी रहे। {season} में यदि वर्षा {rainfall} हो तो पानी कम दें।",
            "{district} में किसान {crop} की सिंचाई हर 7 दिन करें, यदि {season} में वर्षा कम ({rainfall}) हो।",
            "{district} जिले में {crop} की सिंचाई सुबह या शाम करें, ताकि जल की बचत हो।",
            "{district}: {crop} के लिए निरंतर नमी जरूरी है। वर्षा {rainfall} के अनुसार पानी दें।",
            "{crop} के लिए ड्रिप सिंचाई अपनाएँ। {district} में {season} के दौरान सर्वोत्तम तरीका है।",
            "यदि {season} में वर्षा {rainfall} से अधिक हो तो {district} में {crop} को पानी न दें।",
            "{district} में {crop} के लिए वैकल्पिक नाली सिंचाई {season} में करें।",
            "{district} में {crop} की मिट्टी सूखने पर ही पानी दें।",
            "{district}: यदि अगले 48 घंटे में वर्षा होने की संभावना है तो {crop} को पानी न दें।",
            "{district} में मिट्टी का प्रकार {soil} है; इसके अनुसार {crop} की सिंचाई समायोजित करें।",
            "पानी की कमी होने पर {district} में {crop} के लिए ड्रिप या माइक्रो-irrigation का उपयोग करें।"
        ],
        "mr": [
            "{district} मध्ये {crop} साठी {season} मध्ये पाऊस {rainfall} असल्यास हलकी पाणी देणे पुरेसे आहे.",
            "{district} मध्ये {crop} साठी {soil} माती ओलसर ठेवा. {season} मध्ये पाऊस {rainfall} असल्यास पाणी कमी द्या.",
            "{district} शेतकरी {crop} ला प्रत्येक ७ दिवसांनी पाणी द्या, जर {season} मध्ये पाऊस कमी ({rainfall}) असेल.",
            "{district} मध्ये {crop} साठी सकाळी किंवा संध्याकाळी पाणी द्या, पाणी बचतीसाठी.",
            "{district}: {crop} ला सतत आर्द्रता लागते. पाऊस {rainfall} प्रमाणे पाणी द्या.",
            "{crop} साठी ठिबक सिंचन करा. {district} मध्ये {season} साठी योग्य आहे.",
            "जर {season} मध्ये पाऊस {rainfall} पेक्षा जास्त असेल तर {district} मध्ये {crop} ला पाणी देऊ नका.",
            "{district} मध्ये {crop} साठी आळी-आळी सिंचन करा {season} मध्ये.",
            "{district} मध्ये माती कोरडी झाल्यावरच {crop} ला पाणी द्या.",
            "{district}: जर पुढील ४८ तासांत पाऊस येण्याची शक्यता असेल तर {crop} ला पाणी देऊ नका.",
            "{district} मध्ये मातीचा रंग {soil} असल्यास पाण्याचे प्रमाण नियमन करा.",
            "{district} मध्ये पाण्याची बचत करण्यासाठी सकाळी व संध्याकाळी सिंचन करा."
        ]
    },

    "fertilizer": {
        "en": [
            "Use {fertilizer} for {crop} in {district}.",
            "{crop} in {district} needs {fertilizer} during {season} for better yield.",
            "Balanced use of {fertilizer} improves {crop} in {district}.",
            "Avoid over-application of {fertilizer} for {crop} in {district}.",
            "{district} farmers: mix organic manure with {fertilizer} for long-term soil health.",
            "Apply {fertilizer} at sowing for {crop} in {district}, then top-dress as required.",
            "Soil type {soil} in {district} benefits from {fertilizer}.",
            "Split doses of {fertilizer} help {crop} growth in {district}.",
            "For {crop} in {district}, recommended fertilizer is {fertilizer} (per dataset).",
            "If soil N is low ({nitrogen}), consider an N-rich fertilizer in {district}."
        ],
        "hi": [
            "{district} जिले में {crop} के लिए {fertilizer} का प्रयोग करें।",
            "{crop} की उपज बढ़ाने के लिए {district} में {season} में {fertilizer} दें।",
            "{district} में जैविक खाद के साथ {fertilizer} मिलाकर उपयोग करें।",
            "{fertilizer} का अधिक उपयोग {district} में {crop} को नुकसान पहुंचा सकता है।",
            "{district} में मिट्टी {soil} है; {fertilizer} उपयुक्त रहेगा।",
            "नाइट्रोजन का स्तर {nitrogen} है; अनुसंशित {fertilizer} का प्रयोग करें।",
            "{district} में {crop} के लिए छिड़काव या पत्तों पर {fertilizer} का उपयोग कर सकते हैं।",
            "{district} में बुवाई के समय {fertilizer} का उपयोग करें।",
            "टॉप ड्रेसिंग के समय {fertilizer} का विभाजित उपयोग करें।",
            "संतुलित उर्वरक योजना अपनाना {district} में फायदेमंद है।"
        ],
        "mr": [
            "{district} मध्ये {crop} साठी {fertilizer} वापरा.",
            "{district} मध्ये {season} मध्ये {crop} ला {fertilizer} द्या, उत्पादन वाढेल.",
            "सेंद्रिय खतासोबत {fertilizer} मिसळून वापरावे.",
            "{fertilizer} चे जास्त प्रमाण {district} मध्ये नुकसान करू शकते.",
            "{district} माती {soil} आहे; त्यानुसार {fertilizer} वापरा.",
            "नाइट्रोजन पातळी {nitrogen} असल्यास N समृद्ध खत वापरा.",
            "{district} मध्ये पेरणी वेळी {fertilizer} द्या.",
            "टॉप ड्रेसिंगसाठी {fertilizer} चे विभाजित प्रमाण फायदेशीर आहे.",
            "{district} मध्ये {crop} साठी शिफारस केलेले खत: {fertilizer}.",
            "संतुलित खत व्यवस्थापनाने {district} मध्ये उपज सुधारता येते."
        ]
    },

    "pest": {
        "en": [
            "Watch {crop} in {district} for {pest}; use neem-based treatment if necessary.",
            "{district}: High humidity may increase {pest} risk for {crop}. Monitor fields.",
            "Use pheromone traps to reduce {pest} pressure on {crop} in {district}.",
            "Avoid excess pesticide; use IPM methods to control {pest} for {crop}.",
            "Intercropping can help reduce {pest} incidence in {district}.",
            "Regular weeding reduces {pest} for {crop} in {district}.",
            "{district} farmers: choose resistant {crop} varieties to reduce {pest}.",
            "Apply recommended dose only; misuse can harm beneficial insects in {district}.",
            "{district} reports {pest} presence; inspect {crop} immediately.",
            "If {pest} infestation is severe in {district}, contact local extension."
        ],
        "hi": [
            "{district} में {crop} पर {pest} का प्रकोप हो सकता है। नीम का छिड़काव करें।",
            "{district} में उच्च आर्द्रता {pest} का खतरा बढ़ाती है। खेतों की निगरानी करें।",
            "फेरोमोन ट्रैप का प्रयोग {crop} में {pest} को कम करता है।",
            "अत्यधिक कीटनाशक से बचें; IPM अपनाएँ।",
            "इंटरक्रॉपिंग से {pest} दबाव कम हो सकता है।",
            "समय पर निराई-गुड़ाई करने से {pest} कम होता है।",
            "{district} में प्रतिरोधी बुवाई किस्में अपनाएँ।",
            "कीटनाशक का सुझावित खुराक ही प्रयोग करें।",
            "{district} में {pest} दिखा है; तुरंत जाँच करें।",
            "गंभीर स्थिति में स्थानीय कृषि कार्यालय से संपर्क करें।"
        ],
        "mr": [
            "{district} मध्ये {crop} वर {pest} चा धोका आहे; नीम फवारणी करा.",
            "उच्च आर्द्रता {pest} वाढवू शकते; शेत तपासा.",
            "फेरोमोन ट्रॅप वापरून {pest} कमी करा.",
            "खूप कीटकनाशक वापरणे टाळा; IPM वापरा.",
            "इंटरक्रॉपिंगने {pest} कमी होऊ शकतो.",
            "वेळेवर तण काढल्याने {pest} कमी होते.",
            "{district} मध्ये प्रतिरोधक जाती वापरा.",
            "सूचलेल्या प्रमाणेच कीटकनाशक वापरा.",
            "{district} मध्ये {pest} आढळला आहे; लगेच तपासणी करा.",
            "गंभीर आढळल्यास स्थानिक कृषी कार्यालयाला कळवा."
        ]
    },

    "sowing": {
        "en": [
            "Sow {crop} in {district} after first steady rains in {season}.",
            "{district}: Delay sowing if expected rainfall is {rainfall} मिमी.",
            "Best sowing window for {crop} in {district} is {season}.",
            "Use certified seed for {crop} in {district}.",
            "Avoid early sowing to reduce {pest} risk in {district}.",
            "Check soil moisture (type {soil}) before sowing {crop} in {district}.",
            "Line sowing improves {crop} yield in {district}.",
            "Do not sow {crop} if heavy rains ({rainfall}) मिमी are forecast in {district}.",
            "Prepare seedbed according to soil ({soil}) in {district} before sowing.",
            "Adjust sowing depth per crop recommendations for {district}."
        ],
        "hi": [
            "{district} में {season} के बाद पहली स्थिर वर्षा के बाद {crop} बोएँ।",
            "यदि अनुमानित वर्षा {rainfall} मिमी हो तो बुवाई में विलंब करें।",
            "{district} में {crop} की सर्वोत्तम बुवाई अवधि {season} है।",
            "प्रमाणित बीज का उपयोग करें।",
            "शुरूआती बुवाई से कीट का खतरा बढ़ सकता है।",
            "{district} में मिट्टी {soil} की जांच कर बुवाई करें।",
            "लाइन बुवाई से उपज में सुधार होता है।",
            "भारी वर्षा की आशंका होने पर बुवाई न करें।",
            "बुवाई से पहले खेत तैयार करें।",
            "बुवाई गहराई को स्थानीय सलाह के अनुसार समायोजित करें।"
        ],
        "mr": [
            "{district} मध्ये {season} नंतर प्रथम सातत्याने पाऊस झाल्यानंतर {crop} ची पेरणी करा.",
            "जर अंदाजे पाऊस {rainfall} मिमी असेल तर पेरणी उशिरा करा.",
            "{district} मध्ये {crop} ची सर्वोत्तम पेरणी विंडो {season} आहे.",
            "प्रमाणित बियाणे वापरा.",
            "लवकर पेरणी केल्याने कीडचा धोका वाढू शकतो.",
            "{district} मध्ये माती {soil} तपासून पेरणी करा.",
            "लाइन पेरणीने उत्पादन वाढू शकते.",
            "मोठ्या पावसाच्या अंदाजावर पेरणी टाळा.",
            "पेरणीपूर्वी बियाणेची तयारी करा.",
            "पेरणी खोली स्थानिक सल्ल्यानुसार समायोजित करा."
        ]
    },

    "yield": {
        "en": [
            "Estimated yield for {crop} in {district} is {yield} quintals/acre with confidence {confidence}%.",
            "{district}: With current conditions, {crop} may yield around {yield} quintals/acre.",
            "Predicted yield ({yield}) quintals/acre for {crop} in {district}; confidence {confidence}%.",
            "Improved irrigation and correct {fertilizer} may increase {crop} yield beyond {yield} quintals/acre.",
            "Yield estimate for {crop} in {district} is {yield} quintals/acre (based on rainfall {rainfall}).",
            "Current soil N={nitrogen}, pH={ph}. Estimated yield: {yield} for {crop}.",
            "The model predicts {yield} quintals/acre for {crop} in {district}.",
            "With recommended practices, {crop} in {district} could approach {yield} quintals/acre.",
            "Yield forecasts: {yield} quintals/acre ({confidence}% confidence) for {crop} in {district}.",
            "Note: yield estimate {yield} quintals/acre is indicative; local management can change outcomes."
        ],
        "hi": [
            "{district} में {crop} का अनुमानित उत्पादन: {yield} क्विंटल/एकड़ (विश्वसनीयता {confidence}%).",
            "{district}: वर्तमान परिस्थितियों में {crop} की उपज लगभग {yield} क्विंटल/एकड़  हो सकती है।",
            "{crop} के लिए अनुमानित उपज {yield} क्विंटल/एकड़  है; विश्वास {confidence}%.",
            "उचित सिंचाई और {fertilizer} उपयोग से {crop} की उपज बढ़ सकती है।",
            "वर्षा {rainfall} पर आधारित अनुमानित उपज: {yield} क्विंटल/एकड़ .",
            "मिट्टी N={nitrogen}, pH={ph} के साथ अनुमानित उपज {yield} क्विंटल/एकड़ .",
            "{district} में {crop} की भविष्यवाणी: {yield} क्विंटल/एकड़.",
            "{district} में अनुशंसित प्रथाओं से उपज बढ़ सकती है।",
            "उपज अनुमान केवल संकेतक है: {yield} क्विंटल/एकड़ .",
            "विश्वास स्तर {confidence}% के साथ उपज {yield} क्विंटल/एकड़  अनुमानित है।"
        ],
        "mr": [
            "{district} मध्ये {crop} चे अपेक्षित उत्पादन: {yield} क्विंटल/एकर (विश्वासार्हता {confidence}%).",
            "{district}: सध्याच्या परिस्थितीत {crop} ची उपज सुमारे {yield} असू शकते.",
            "{crop} साठी अंदाजित उत्पादन {yield} क्विंटल/एकर ; विश्वास {confidence}%.",
            "योग्य सिंचन आणि {fertilizer} मुळे {crop} ची उपज वाढू शकते.",
            "पावसावर  आधारित उत्पादन अंदाज: {yield} क्विंटल/एकर .",
            "माती N={nitrogen}, असल्यास उत्पादन अंदाज {yield} क्विंटल/एकर .",
            "{district} मध्ये {crop} चे उत्पादन {yield} क्विंटल/एकर  आहे.",
            "शिफारसीनुसार केल्यास उपज {yield} क्विंटल/एकर  पर्यंत वाढू शकते.",
            "उपज अंदाज निर्देशात्मक आहे: {yield} क्विंटल/एकर .",
            "विश्वास पातळी {confidence}% सह उत्पादन {yield} क्विंटल/एकर  अंदाजित आहे."
        ]
    },

    "rainfall": {
        "en": [
            "Rainfall record for {district}: {rainfall} mm and avg temp {temperature}°C.",
            "{district}: Historical rainfall {rainfall} mm; check forecasts for upcoming days.",
            "Expected rainfall impact on {crop}: {rainfall} mm noted in records for {district}.",
            "IMD-like forecast: {rainfall} mm could occur in {district} during {season}.",
            "Rainfall {rainfall} mm may reduce need for irrigation in {district}.",
            "Local rainfall {rainfall} mm recorded; temperature {temperature}°C.",
            "Rain stats ({district}): {rainfall} mm recent, please plan sowing accordingly.",
            "Rainfall probability for {district} is high; recorded {rainfall} mm average.",
            "{district} rainfall data: {rainfall} mm (useful for irrigation planning).",
            "Rainfall {rainfall} mm — adjust fertilizer/sowing decisions for {crop}."
        ],
        "hi": [
            "{district} में रिकॉर्ड वर्षा: {rainfall} मिमी और औसत तापमान {temperature}°C।",
            "{district}: ऐतिहासिक वर्षा {rainfall} मिमी; आने वाले दिनों के पूर्वानुमान देखें।",
            "{crop} पर संभावित प्रभाव: {district} में वर्षा {rainfall} मिमी रिकॉर्ड की गई।",
            "{district} में {season} के दौरान {rainfall} मिमी की उम्मीद हो सकती है।",
            "{district} में वर्षा {rainfall} मिमी होने पर सिंचाई कम करें।",
            "{district} में हाल ही में {rainfall} मिमी रिकॉर्ड हुआ; योजना बनाएं।",
            "{district} की वर्षा जानकारी: {rainfall} मिमी (बुवाई/सिंचाई के लिए उपयोगी)।",
            "वर्षा का प्रभाव {rainfall} मिमी — {district} में सावधानी बरतें।",
            "{district} में तापमान {temperature}°C और वर्षा {rainfall} मिमी।",
            "{district} में वर्षा {rainfall} मिमी के अनुसार उर्वरक योजना समायोजित करें।"
        ],
        "mr": [
            "{district} मध्ये नोंदवलेला पाऊस: {rainfall} मिमी आणि सरासरी तापमान {temperature}°C.",
            "{district}: ऐतिहासिक पाऊस {rainfall} मिमी आहे; आगामी अंदाज पहा.",
            "{crop} वर संभाव्य प्रभाव: {district} मध्ये पाऊस {rainfall} मिमी नोंदवला आहे.",
            "{district} मध्ये {season} दरम्यान {rainfall} मिमी पाऊस अपेक्षित असू शकतो.",
            "{district} मध्ये पाऊस {rainfall} मिमी असल्यास सिंचन कमी करा.",
            "{district} मध्ये अलीकडील पाऊस {rainfall} मिमी नोंदला आहे; नियोजन करा.",
            "{district} चा पाऊस डेटा: {rainfall} मिमी (पेरणी/सिंचन सल्ल्यासाठी उपयुक्त).",
            "पाऊस {rainfall} मिमी — {district} मध्ये काळजी घ्या.",
            "{district} मध्ये तापमान {temperature}°C व पाऊस {rainfall} मिमी.",
            "{district} मध्ये पाऊस {rainfall} मिमी असल्यास खत योजना बदला."
        ]
    }
}

# ------------------ CSV DATA HELPERS (no pandas) ------------------

DEFAULT_DATA_PATH = "Final_Dataset_2.csv"



def load_dataset(path=DEFAULT_DATA_PATH, normalize_cols=True):
    """
    Load CSV into a list of dicts.
    Normalizes column names (lowercase, no spaces) and keys.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at: {path}")
    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for raw in reader:
            # Normalize column keys to simple lowercase names without spaces
            row = {}
            for k, v in raw.items():
                if k is None:
                    continue
                key = k.strip()
                key_norm = key.lower().replace(" ", "_")
                # row[key_norm] = v.strip() if isinstance(v, str) else v
                if v is None:
                    row[key_norm] = ""
                else:
                    row[key_norm] = str(v).strip()
            rows.append(row)
    return rows

def find_best_row(data, district=None, crop=None,soil = None,fertilizer = None,rainfall = None,pest  = None,season = None,Temperature = None,nitrogen = None,phosphorous = None):
    """
    Find best matching row by district and crop (case-insensitive).
    If multiple matches exist, pick one (random) or the most recent if date present.
    Returns None if no match.
    """
    if not data:
        return None
    candidates = data
    if district:
        district = district.strip().lower()
        candidates = [r for r in candidates if r.get("district_name","").strip().lower() == district]
    if crop:
        crop = crop.strip().lower()
        candidates = [r for r in candidates if r.get("crop","").strip().lower() == crop]
    if soil :
        soil = soil.strip().lower()
        candidates = [r for r in candidates if r.get("soil_color","soil").strip().lower()==soil]
    if fertilizer : 
        fertilizer = fertilizer.strip().lower()
        candidates = [r for r in candidates if r.get("fertilizer","").strip().lower()==fertilizer]
    if rainfall : 
        rainfall = rainfall.strip().lower()
        candidates = [r for r in candidates if r.get("rainfall","").strip().lower()==rainfall]
    if pest : 
        pest = pest.strip().lower()
        candidates = [r for r in candidates if r.get("pest","").strip().lower()==pest]
    if season : 
        season = season.strip().lower()
        candidates = [r for r in candidates if r.get("season","").strip().lower()==season]
    if Temperature : 
        Temperature = Temperature.strip().lower()
        candidates = [r for r in candidates if r.get("Temperature","").strip().lower()==Temperature]
    if nitrogen : 
        nitrogen= nitrogen.strip().lower()
        candidates = [r for r in candidates if r.get("nitrogen","").strip().lower()==nitrogen]   
    if phosphorous:
        phosphorous = phosphorous.strip().lower()
        candidates = [r for r in candidates if r.get("phosphorous","").strip().lower()== phosphorous]
    if not candidates:
        return None
    # Prefer exact match if available, else random choice
    return random.choice(candidates)

def safe_get(row, keys, default="N/A"):
    """
    Try multiple possible column keys and return first found and non-empty.
    """
    if not row:
        return default
    for k in keys:
        val = row.get(k)
        if val is None:
            continue
        vs = str(val).strip()
        if vs != "" and vs.lower() not in ("nan","none","n/a"):
            return vs
    return default
def infer_season(month_str):
    """
    Infer season from month number/name (basic Indian context).
    Returns: Kharif, Rabi, Zaid, or Unknown.
    """
    if not month_str:
        return "Unknown"
    m = str(month_str).strip().lower()
    # try numeric
    try:
        mnum = int(m)
    except:
        # try month names
        months = {
            "jan":1,"feb":2,"mar":3,"apr":4,"may":5,"jun":6,
            "jul":7,"aug":8,"sep":9,"oct":10,"nov":11,"dec":12
        }
        for k,v in months.items():
            if m.startswith(k):
                mnum = v
                break
        else:
            return "Unknown"
    # map to Indian crop seasons
    if mnum in (6,7,8,9,10):   # June–Oct
        return "Kharif"
    elif mnum in (11,12,1,2,3): # Nov–Mar
        return "Rabi"
    elif mnum in (4,5):        # Apr–May
        return "Zaid"
    return "Unknown"
def estimate_yield(row):
    """
    Estimate yield (quintals/acre) if missing.
    Uses simple heuristic: based on nitrogen, rainfall, temperature.
    """
    try:
        n = float(row.get("nitrogen", 0) or 0)
        rain = float(row.get("rainfall", 0) or 0)
        temp = float(row.get("temperature", 25) or 25)
        # crude heuristic formula
        base = (n/2) + (rain/100) + (30 - abs(temp-25))
        return round(max(5, min(base, 60)), 1)  # clamp 5–60 quintals/acre
    except:
        return 25  # fallback default

def build_fill_values(row, district, crop,soil,fertilizer,rainfall,pest,season,Temperature,nitrogen,phosphorous,lang = "en"):
    """
    Build a dictionary of placeholder values for templates from the dataset row.
    Uses column names found in your Final_Dataset_2.csv:
      District_Name, Soil_Color, Nitrogen, Phosphorus, Potassium, pH, Rainfall, Temperature, Crop, Fertilizer, Link
    We normalized keys to lowercase with underscores in load_dataset().
    """
    vals = {}
    vals["district"] = district or safe_get(row, ["district_name", "district"]) 
    vals["crop"] = crop or safe_get(row, ["crop"])
    vals["soil"] = safe_get(row, ["soil_color", "soil"])
    vals["fertilizer"] = safe_get(row, ["fertilizer"])
    vals["rainfall"] = safe_get(row, ["rainfall", "precipitation", "precipitationsuminches"])
    vals["temperature"] = safe_get(row, ["temperature", "temphighf", "tempavgf", "templowf"])
    vals["pest"] = safe_get(row, ["events", "pest"])
    season_val = safe_get(row, ["season"])
    if season_val == "N/A" or season_val.isdigit():
    # try to infer from month number
      season_val = infer_season(season_val)
    vals["season"] = season_val

    yield_val = safe_get(row, ["yield"])
    if yield_val == "N/A" or yield_val.strip() == "":
        try:
            yield_val = str(predict_yield(row))  # use ML model
        except Exception:
            yield_val = str(estimate_yield(row)) # fallback heuristic
    vals["yield"] = yield_val
    vals["yield"] = yield_val if yield_val != "N/A" else str(estimate_yield(row))
    vals["confidence"] = safe_get(row, ["confidence"], default="75")
    vals["nitrogen"] = safe_get(row, ["nitrogen"])
    
    vals["ph"] = safe_get(row, ["p_h", "ph"])  # sometimes pH normalized differently
     # Translate all values if language is not English
    if lang != "en":
        for key in vals:
            vals[key] = vals[key]
    
    return vals
    # return vals

def pick_template(intent, lang):
    """
    Pick a random template string for the given intent and language.
    """
    intent = intent if intent in TEMPLATES else "irrigation"
    lang = lang if lang in TEMPLATES.get(intent, {}) else "en"
    choices = TEMPLATES[intent][lang]
    return random.choice(choices)

def generate_filled_template(intent, lang="en", district=None, crop=None,
                             soil=None, fertilizer=None, rainfall=None,
                             pest=None, season=None, Temperature=None,
                             nitrogen=None, phosphorous=None,
                             data_path=DEFAULT_DATA_PATH):
    """
    High-level helper:
      - loads dataset (CSV) without pandas
      - finds the best matching row for district+crop
      - picks a template and fills placeholders from the row
    Returns: filled string
    """
    # Load dataset
    try:
        data = load_dataset(data_path)
    except FileNotFoundError:
        # If dataset not present, just return a template with defaults
        template = pick_template(intent, lang)
        return template.format(
            district=district or "your district",
            crop=crop or "your crop",
            soil=soil or "soil",
            fertilizer=fertilizer or "fertilizer",
            rainfall=rainfall or "rainfall",
            pest=pest or "pest",
            season=season or "season",
            confidence="75",
            temperature=Temperature or "25",
            nitrogen=nitrogen or "N",
            ph="7",
            **{"yield": "20"}

        )

    # find matching row
    row = find_best_row(
        data, district=district, crop=crop, soil=soil,
        fertilizer=fertilizer, rainfall=rainfall,
        pest=pest, season=season, Temperature=Temperature,
        nitrogen=nitrogen, phosphorous=phosphorous
    )

    vals = build_fill_values(row, district, crop, soil, fertilizer,
                             rainfall, pest, season, Temperature,
                             nitrogen, phosphorous, lang)

    # pick template
    template = pick_template(intent, lang)
    vals = {k: (v if v not in ("N/A", "Unknown", None, "") else "not recorded")
        for k, v in vals.items()}

    # fill template safely
    try:
        filled = template.format(
            crop=vals.get("crop", "your crop"),
            district=vals.get("district", "your district"),
            soil=vals.get("soil", "soil"),
            fertilizer=vals.get("fertilizer", "fertilizer"),
            rainfall=vals.get("rainfall", "rainfall"),
            pest=vals.get("pest", "pest"),
            season=vals.get("season", "season"),
            confidence=vals.get("confidence", "75"),
            temperature=vals.get("temperature", "25"),
            nitrogen=vals.get("nitrogen", "N"),
            ph=vals.get("ph", "7"),
            **{"yield": vals.get("yield", "20")}
        )
    except KeyError as e:
        filled = f"[Template error: missing {e}]"
    
    return filled
def clean_reply(text):
    bad = ["N/A", "Unknown", "not recorded", "None", "null"]
    for b in bad:
     text = text.replace(b, "").replace("  ", " ")
    return text.strip()



# ------------- small CLI test helper -------------
if __name__ == "__main__":
    print("templates.py quick test (requires Final_Dataset_2.csv in same folder).")
    for intent in ["irrigation","fertilizer","pest","sowing","yield","rainfall"]:
        print("----", intent, "EN ----")
        print(generate_filled_template(intent, lang="en", district=None, crop=None,soil = None,fertilizer=None,rainfall=None,pest = None,season=None,Temperature=None,nitrogen=None,phosphorous=None))
        print("----", intent, "HI ----")
        print(generate_filled_template(intent, lang="hi", district=None, crop=None,soil = None,fertilizer=None,rainfall=None,pest = None,season=None,Temperature=None,nitrogen=None,phosphorous=None))
        print("----", intent, "MR ----")
        print(generate_filled_template(intent, lang="mr", district=None, crop=None,soil = None,fertilizer=None,rainfall=None,pest = None,season=None,Temperature=None,nitrogen=None,phosphorous=None))
        print()

