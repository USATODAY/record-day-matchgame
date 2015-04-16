import xlrd
import json
import os
import datetime
import re
# from slack_tools import slack_notify

source_file = os.path.join(os.path.dirname(__file__), 'src/data.xlsx')
output_json_file = os.path.join(os.path.dirname(__file__), 'output/data.json')

def open_file():
    wb = xlrd.open_workbook(source_file)
    return wb

def read_sheet(sh):
    column_names = []
    for i in range(sh.ncols):
        header = sh.cell(0, i).value
        column_names.append(header)

    # list to store each row's data
    sheet_list = []

    # loop through rows
    for rownum in range(1, sh.nrows):
        # dict to store each column with key from header row
        row_dict = {
            "id": rownum
        }

        # loop through each column in row
        for colnum in range(sh.ncols):
            value = sh.cell(rownum, colnum).value
            row_dict[column_names[colnum]] = value

        sheet_list.append(row_dict)

    return sheet_list

def read_wb(wb):
    sheets_list = []
    for sheet_index in range(wb.nsheets):
        sh = wb.sheet_by_index(sheet_index)
        sheet_list = read_sheet(sh)
        sheets_list.append(sheet_list)
    return sheets_list


def format_data():
    wb = open_file()
    wb_data = read_wb(wb)
    with open (output_json_file, 'w') as output_file:
        json.dump({'games': wb_data}, output_file)

if __name__ == "__main__":
    format_data()
