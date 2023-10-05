import csv

csv_file_path = "C:/Users/yalme/Downloads/generatedBy_react-csv (7).csv"

street_names = {
    1733: {"name": "GOSNELL TERR", "location": "ORLNON06_2173A"},
    1734: {"name": "DENTON WAY", "location": "ORLNON06_2173A"},
    1739: {"name": "FRENETTE ST", "location": "ORLNON06_2173A"},
    1735: {"name": "NEPTUNE WAY", "location": "ORLNON06_2173A"},
    1737: {"name": "VALIN ST", "location": "ORLNON06_2173A"},
    1738: {"name": "SAFARI CRT", "location": "ORLNON06_2173A"},
    1736: {"name": "TOPHAM TERR", "location": "ORLNON06_2173A"}
}

# Open the input CSV file for reading
with open(csv_file_path, 'r', newline='') as input_file:
    # Read the CSV data
    csv_reader = csv.DictReader(input_file)
    data = list(csv_reader)

# Function to update street and location columns
def update_street_location(row):
    street_id = int(row['streetId'])
    if street_id in street_names:
        row['street'] = street_names[street_id]['name']
        row['location'] = street_names[street_id]['location']
    return row

# Apply the update function to each row
updated_data = [update_street_location(row) for row in data]

# Open the output CSV file for writing
with open('formatted_output.csv', 'w', newline='') as output_file:
    # Define the field names
    fieldnames = csv_reader.fieldnames
    # Write the updated data to the output file
    csv_writer = csv.DictWriter(output_file, fieldnames=fieldnames)
    csv_writer.writeheader()
    csv_writer.writerows(updated_data)

print("CSV file updated and saved as 'output.csv'.")

