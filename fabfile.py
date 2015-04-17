from data_tools.updatedata import get_data
from data_tools.formatdata import format_data
from data_tools.slack_tools import slack_notify
from fabric.operations import local as run
from fabric.api import local
from data_tools.ftpup import connect_ftp, upload_file
import os

slack_channel = "@mitchthorson"

def create_absolute_path(relative_path):
    return os.path.join(os.path.dirname(__file__), relative_path)

master_spreadsheet = create_absolute_path('data_tools/src/data.xlsx')

def updater(target="dev"):
    print ("Downloading new data file from Google...")
    try:
        get_data()
    except:
        # slack_notify("Hello, I had a problem downloading the Sunday Talk show spreadsheet from Google.", slack_channel)
        raise
    
    print("Formatting data...")
    try:
        format_data()
    except:
        # slack_notify("Hello, I was unable to format the latest data file correctly.", slack_channel)
        raise
    # print("Uploading data...")
    try:
        print "moving data to source folder"
        local("cp data_tools/output/data.json src/data")
    except:
        print "Couldn't copy new data to src folder"
        pass

def upload():
    try:
        print "uploading data to the server..."
        ftp_conn = connect_ftp()
        ftp_conn.cwd("usatoday/2015/04/record-day/data/")
        upload_file(ftp_conn, create_absolute_path('data_tools/output/data.json'))
        print ("success!")
    except:
        print "error uploading data to the server...are you sure you have $FTP_USER, $FTP_PASS, and $FTP_SERVER set as environment variables?"
        # slack_notify("I had a problem uploading the new data to the server.", slack_channel)
        pass
