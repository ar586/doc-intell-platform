import sys
import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def scrape_books():
    options = Options()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)
    
    driver.get("http://books.toscrape.com/catalogue/category/books_1/index.html")
    
    books = []
    # Scrape first 5 books for demo
    book_elements = driver.find_elements(By.CSS_SELECTOR, "article.product_pod")[:5]
    urls_to_scrape = []
    
    for el in book_elements:
        link = el.find_element(By.CSS_SELECTOR, "h3 a").get_attribute('href')
        urls_to_scrape.append(link)

    for url in urls_to_scrape:
        driver.get(url)
        title = driver.find_element(By.CSS_SELECTOR, "div.product_main h1").text
        author = "Unknown Author" # Site lacks author info
        
        try:
            rating_element = driver.find_element(By.CSS_SELECTOR, "p.star-rating")
            rating = rating_element.get_attribute("class").split()[-1] + " Stars"
        except:
            rating = "No Rating"
            
        try:
            description = driver.find_element(By.XPATH, "//div[@id='product_description']/following-sibling::p").text
        except:
            description = "No description available."
            
        cover_image = driver.find_element(By.CSS_SELECTOR, "div.item.active img").get_attribute("src")
        
        book_data = {
            "title": title,
            "author": author,
            "rating": rating,
            "description": description,
            "url": url,
            "cover_image_url": cover_image
        }
        books.append(book_data)
        
    driver.quit()
    return books

if __name__ == "__main__":
    print("Scraping books...")
    data = scrape_books()
    for b in data:
        print(f"Uploading {b['title']}...")
        r = requests.post("http://localhost:8000/api/upload/", json=b)
        print(r.status_code, r.text)
