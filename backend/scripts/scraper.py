"""News scraper that generates sample articles."""
from datetime import datetime, timedelta
import random

# Sample article templates
ARTICLE_TEMPLATES = [
    {
        "title": "JEE Main 2024 Registration Opens - Apply Now",
        "content": "The National Testing Agency (NTA) has announced the opening of registration for JEE Main 2024. Students can register online at jeemain.nta.ac.in. The last date for registration is December 15, 2023. The examination will be conducted in multiple sessions starting from January 2024.",
        "summary": "JEE Main 2024 registration is now open. Last date: December 15, 2023.",
        "tags": ["exam", "engineering", "JEE"],
    },
    {
        "title": "NEET 2024 Application Form Released",
        "content": "The NEET 2024 application form is now available on the official website. Candidates must complete the registration process before the deadline. The examination date will be announced soon.",
        "summary": "NEET 2024 application form released. Registration deadline approaching.",
        "tags": ["exam", "medical", "NEET"],
    },
    {
        "title": "UP Board Class 12 Results 2023 Declared",
        "content": "The Uttar Pradesh Board has declared the Class 12 results for the year 2023. Students can check their results on the official website upresults.nic.in using their roll number and date of birth.",
        "summary": "UP Board Class 12 results 2023 declared. Check online with roll number.",
        "tags": ["result", "board", "UP Board"],
    },
    {
        "title": "Merit-Based Scholarship for Engineering Students",
        "content": "Applications are invited for merit-based scholarships for engineering students. Eligible candidates must have secured at least 80% marks in their previous examination. The scholarship amount is Rs. 50,000 per year. Last date to apply: November 30, 2023.",
        "summary": "Merit-based engineering scholarship. Rs. 50,000/year. Apply by Nov 30, 2023.",
        "tags": ["scholarship", "engineering", "merit"],
    },
    {
        "title": "CBSE Class 10 Board Exam Dates Announced",
        "content": "The Central Board of Secondary Education has announced the dates for Class 10 board examinations. The exams will commence from February 15, 2024. Detailed timetable will be released soon.",
        "summary": "CBSE Class 10 board exams start February 15, 2024. Timetable coming soon.",
        "tags": ["exam", "board", "CBSE"],
    },
    {
        "title": "New Scholarship Program for Underprivileged Students",
        "content": "A new scholarship program has been launched to support underprivileged students pursuing higher education. The program covers tuition fees and provides a monthly stipend. Applications open from December 1, 2023.",
        "summary": "New scholarship for underprivileged students. Applications open Dec 1, 2023.",
        "tags": ["scholarship", "financial aid", "education"],
    },
    {
        "title": "GATE 2024 Admit Card Download Available",
        "content": "The admit cards for GATE 2024 are now available for download. Candidates can access their admit cards from the official GATE website using their registration credentials.",
        "summary": "GATE 2024 admit cards available for download.",
        "tags": ["exam", "GATE", "admit card"],
    },
    {
        "title": "ICSE Board Results 2023 Published",
        "content": "The Council for the Indian School Certificate Examinations has published the ICSE board results for 2023. Students can check their results online at results.cisce.org.",
        "summary": "ICSE board results 2023 published. Check online now.",
        "tags": ["result", "board", "ICSE"],
    },
]


def generate_sample_articles(count: int = 5) -> list:
    """Generate sample articles for testing/scraping."""
    articles = []
    base_url = "https://edunews.example.com/article"
    
    # Shuffle and take random articles
    templates = random.sample(ARTICLE_TEMPLATES, min(count, len(ARTICLE_TEMPLATES)))
    
    for i, template in enumerate(templates):
        # Generate unique source URL
        source_url = f"{base_url}/{datetime.now().strftime('%Y%m%d')}-{i+1}"
        
        # Random published date within last 30 days
        days_ago = random.randint(0, 30)
        published_at = datetime.now() - timedelta(days=days_ago)
        
        article = {
            "title": template["title"],
            "content": template["content"],
            "source_url": source_url,
            "summary": template["summary"],
            "tags": template["tags"],
            "published_at": published_at,
        }
        articles.append(article)
    
    return articles

