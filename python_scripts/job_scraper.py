import json
import os
from scrapling.fetchers import StealthyFetcher
from datetime import datetime

def scrape_jobs():
    print("Starting Scrapling (Stealth) Scraper...")
    
    # URL for Odisha Govt Jobs (Corrected URL)
    url = "https://www.freejobalert.com/odisha-government-jobs/"
    
    # Initialize Scrapling StealthFetcher (Uses Camoufox/Firefox for bypassing)
    page = StealthyFetcher.fetch(url, headless=True)
    
    print(f"Fetch Status: {page.status}")

    # Target table containing the job listings
    # Structure: 3 rows per job starting from the 4th row
    rows = page.css('div.entry-content table tr')
    
    jobs = []
    
    # Start from index 3 (4th row) and jump by 3
    for i in range(3, len(rows), 3):
        try:
            # Row 1: Post Date & Recruitment Entity
            meta_row = rows[i]
            post_date_raw = meta_row.css('td:nth-child(1)::text').get()
            entity = meta_row.css('td:nth-child(2) b::text').get() or meta_row.css('td:nth-child(2)::text').get()
            
            # Row 2: Post Name & Qualification
            title_row = rows[i+1]
            title = title_row.css('td:nth-child(1) b::text').get() or title_row.css('td:nth-child(1)::text').get()
            qualification = title_row.css('td:nth-child(2)::text').get()
            
            # Row 3: Last Date & Link
            link_row = rows[i+2]
            last_date_raw = link_row.css('td:nth-child(1)::text').get()
            apply_link = link_row.css('td:nth-child(2) a::attr(href)').get()
            
            if not title or not entity:
                continue

            # Clean and format data
            job_id = f"scraped-{i}"
            
            # Map Category
            category = "Other"
            entity_upper = entity.upper()
            if "OSSC" in entity_upper: category = "OSSC"
            elif "OPSC" in entity_upper: category = "OPSC"
            elif "RAILWAY" in entity_upper: category = "Railway"
            elif "BANK" in entity_upper or "SBI" in entity_upper: category = "Bank"
            elif "POLICE" in entity_upper: category = "Police"
            
            # Date Parsing (Expected DD-MM-YYYY)
            post_date_iso = datetime.now().isoformat()
            if post_date_raw:
                try:
                    post_date_iso = datetime.strptime(post_date_raw.strip(), "%d-%m-%Y").isoformat()
                except: pass

            jobs.append({
                "id": job_id,
                "title": title.strip(),
                "organization": entity.strip(),
                "postDate": post_date_iso,
                "lastDate": last_date_raw.strip() if last_date_raw else "TBA",
                "vacancies": None,
                "qualification": qualification.strip() if qualification else "Any",
                "category": category,
                "applyLink": apply_link if apply_link else "#",
                "isNew": True
            })
            
        except Exception as e:
            print(f"Error parsing row {i}: {e}")
            continue

    print(f"Successfully scraped {len(jobs)} jobs.")

    # Overwrite the jobs.json file (User request: delete existing jobs)
    output_path = os.path.join(os.path.dirname(__file__), '../../public/data/jobs.json')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, indent=4)
    
    print(f"Master JSON updated at {output_path}")

if __name__ == "__main__":
    scrape_jobs()
