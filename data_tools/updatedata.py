from gdocs import GoogleDoc

doc_1 = {
    "key": "1kBSSNi-S6f2KOSbmioPo-Re25B9F0uyIY4gW23h-ilo",
    "file_name": "data",
    "file_format": "xlsx"
}

def get_data():
    g = GoogleDoc(**doc_1)
    g.get_auth()
    g.get_document()
    
if __name__ == "__main__":
    get_data()
