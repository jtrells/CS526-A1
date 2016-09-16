import csv
import json
import urllib2
import time
import pandas as pd

def get_county_info(zip_codes, counties_annotations, county, state):
    try:
        filtered_county = zip_codes[zip_codes['COUNTY'] == county]
        info = filtered_county[filtered_county['STATE'] == state].values[0]

        #url = 'http://data.fcc.gov/api/block/find?format=json&latitude=' + str(lat) + '&longitude=' + str(lng)
        #data = json.load(urllib2.urlopen(url))
        #return data['County']['name']

        #if "(city)" in county:
         #   county = county.replace("(", "")
          #  county = county.replace(")", "")
           # geography1 = county + ", " + state
            #geography1 = geography1.strip()
        #else:
         #   geography1 = county + " County, " + state
          #  geography2 = county + " Parish, " + state

        #print(county + " " + state + " / " + geography1)
        #annotations = counties_annotations[counties_annotations['Geography'] == geography1]
        #if annotations.size == 0:
         #   print ('yes')
          #  annotations = counties_annotations[counties_annotations['Geography'] == geography2]

        #if annotations.empty:
         #  print (geography1 + " " + geography2 + "\n")
        #annotations = annotations.values[0]

        if not info.size == 0:
            lat = info[2]
            long=info[3]
            state_abbreviation = info[8]

            url = 'http://data.fcc.gov/api/block/find?format=json&latitude=' + str(lat) + '&longitude=' + str(long)
            data = json.load(urllib2.urlopen(url))
            id2 = data['County']['FIPS']
         #   id = annotations[0]
          #  id2 = annotations[1]
            return lat, long, state_abbreviation, id2
        else:
            print ("Empty: " + str(county) + " " + str(state))
            return "", "", ""
    except ValueError:
        print (str(ValueError) + " " + county + " " + str(state))
        return None, None, None, None

zip_codes = pd.read_csv('../data/zip_codes.csv')
counties_annotations = pd.read_csv('../data/ACS_14_5YR_B01003_with_ann.csv')

with open('../data/aggregated_zipcodes.csv', 'r') as csvinput:
    reader = csv.reader(csvinput)
    counties = []

    counties.append(['COUNTY', 'LAT', 'LONG', 'POPULATION', 'STATE', 'STATE_ABBREVIATION', 'ID2'])

    for row in reader:
        county = row[0]
        state = row[1]
        population = row[2]

        time.sleep(0.1)
        lat, long, state_abbreviation, id2 = get_county_info(zip_codes, counties_annotations, county, state)
        counties.append([county, lat, long, population, state, state_abbreviation, id2])

    csvinput.close()

with open('../data/counties2.csv', 'w') as csv_output:
    writer = csv.writer(csv_output, lineterminator='\n')
    writer.writerows(counties)
    csv_output.close()
