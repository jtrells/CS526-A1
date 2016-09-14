import json
import urllib2
import csv
import time
import pandas as pd
__author__ = 'juan'


def get_location_info(zip_code, zip_df):
    #url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + str(zip_code)
    #data = json.load(urllib2.urlopen(url))
    #print(zip_code)
    try:
        row = zip_df[zip_df['PostalCode'] == int(zip_code)]

        if not row.empty:
            city = row['Place Name'].values[0]
            county = row['County'].values[0]
            state = row['State'].values[0]
            short_state = row['State Abbreviation'].values[0]
            return city, county, state, short_state
        else:
            print ("Empty: " + str(zip_code))
            return "", "", "", ""
    except ValueError:
        print str(ValueError) + " " + str(zip_code)
        return None, None, None, None

print('init')

zip_df = pd.read_csv('../data/us_postal_codes.csv')
tests_df = pd.read_csv('../data/ACT_TestEvents.csv')

with open('../data/ACT_AllPointsFile.csv', 'r') as csvinput:
    reader = csv.reader(csvinput)
    test_centers = []
    zip_codes = []

    test_centers.append(['POINT_ID', 'ZIP_CODE', 'LAT', 'LONG', 'TEST_CENTER_ID', 'CENTER_TYPE', 'INSTITUTION', 'CITY',
                         'COUNTY', 'STATE', 'STATE_ABBREVIATION', 'CAPACITY'])
    zip_codes.append(['POINT_ID', 'ZIP_CODE', 'LAT', 'LONG', 'POPULATION', 'CITY', 'COUNTY', 'STATE',
                     'STATE_ABBREVIATION'])

    reader.next()
    for row in reader:
        point_id = row[0]
        zip_code = row[1]
        latitude = row[2]
        longitude = row[3]
        point_type = row[4]
        test_center_id = row[5]
        center_type = row[6]
        institution = row[7]
        population = row[8]

        city, county, state, short_state = get_location_info(zip_code, zip_df)

        if city is not None:
            if point_type == "TESTCENTER":
                cap_row = tests_df[tests_df['TestCenterID'] == int(test_center_id)]
                capacity = cap_row['CAPACITY'].values[0]
                test_centers.append([point_id, zip_code, latitude, longitude, test_center_id, center_type, institution,
                                     city, county, state, short_state, capacity])
            else:
                zip_codes.append([point_id, zip_code, latitude, longitude, population, city, county, state,
                                  short_state])
    csvinput.close()

with open('../data/test_centers2.csv', 'w') as csv_output:
    writer = csv.writer(csv_output, lineterminator='\n')
    writer.writerows(test_centers)
    csv_output.close()

with open('../data/zip_codes.csv2', 'w') as csv_output:
    writer = csv.writer(csv_output, lineterminator='\n')
    writer.writerows(zip_codes)
    csv_output.close()

print('end')
