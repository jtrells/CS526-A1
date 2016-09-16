import json
import pandas as pd

__author__ = 'juan'

expenses_df = pd.read_csv('../data/events_aggregated.csv')
file_data = open('../data/us-10m.json').read()
data = json.loads(file_data)


def get_expense_per_state(state_code):
    print(state_code)
    expense = expenses_df[expenses_df['STATE_CODE'] == int(state_code)]

    if (not expense.empty):
        values = expense.values[0]
        return values[1], values[2], values[3], values[4]
    else:
        return None, None, None, None

for geometry in data['objects']['states']['geometries']:
    id = geometry['id']
    exp_2012, exp_2013, exp_2014, exp_2015 = get_expense_per_state(id)

    if exp_2012 is not None:
        properties = {'exp_2012': exp_2012, 'exp_2013': exp_2013, 'exp_2014': exp_2014, 'exp_2015': exp_2015}
        geometry['properties'] = properties

with open('us-expenses.json', 'w') as outfile:
    json.dump(data, outfile)
    outfile.close()