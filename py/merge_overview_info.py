import csv
import pandas as pd
__author__ = 'juan'

states_df = pd.read_csv('../data/us-state-names.csv')
test_centers_df = pd.read_csv('../data/test_centers.csv')


def get_state_info(test_center_id):
    test_center = test_centers_df[test_centers_df['TEST_CENTER_ID'] == int(test_center_id)]
    state_info = states_df[states_df['code'] == test_center.values[0][10]]

    return test_center.values[0][9], state_info.values[0][0], test_center.values[0][10]

with open('../data/ACT_TestEvents.csv', 'r') as csvinput:
    reader = csv.reader(csvinput)
    events = []

    events.append(['TESTCENTERID', 'TESTEVENTID', 'YEAR', 'MONTH', 'CAPACITY', 'ASSIGNED', 'EXPENSE',
                   'CYCLE_DESCRIPTION', 'ADMIN_GROUP', 'STATE_ID', 'STATE_NAME', 'STATE_ABBREVIATION'])

    reader.next()
    for row in reader:
        state_name, state_id, state_abbreviation = get_state_info(row[0])

        events.append([row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10],
                         state_id, state_name, state_abbreviation])
    csvinput.close()

with open('../data/events.csv', 'w') as csv_output:
    writer = csv.writer(csv_output, lineterminator='\n')
    writer.writerows(events)
    csv_output.close()
