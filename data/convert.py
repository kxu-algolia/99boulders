import sys
import csv
import json
import xml.etree.ElementTree as ET
csv.field_size_limit(sys.maxsize)

# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvFilePath, jsonFilePath):
    data = []

    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        for row in csvReader:
            record = {}

            # Variants
            variants = []
            for child in ET.fromstring(row['Variants XML']):
                attributes = ['sku', 'vendor_sku', 'upc', 'size', 'color', 'retail_price', 'sale_price']
                variant = {}
                for attrib in attributes:
                    try:
                        variant[attrib] = child.find(attrib).text
                    except:
                        pass
                variants.append(variant)

            # Set Product ID
            record['product_id'] = row['SKU']
            print("processing", row['SKU'])

            # Remove Unused Fields
            remove = [
                'SKU',
                'Product Page View Tracking',
                'Variants XML',
                'Product Content Widget',
                'Google Categorization',
                'Item Based Commission',
            ]
            for item in remove:
                row.pop(item)

            # Convert keys to snake_case
            for key, val in row.items():
                k = snake_case(camelCase(key))
                record[k] = val

            # Enrichment - Inventory & Sale
            record['in_stock']  = (record['availability'] == 'in-stock')
            record['on_sale']   = (record['sale_price'] < record['retail_price'])
            price_diff = float(record['retail_price']) - float(record['sale_price'])
            record['sale_percentage'] = round((price_diff / float(record['retail_price'])) * 100)

            # Enrichment - Heirarchical Facets
            category = record['category']
            subcategory = record['subcategory']
            product_group = record['product_group']
            heirarchies = {
                'lvl0': '%s' % (category),
                'lvl1': '%s > %s' % (category, subcategory),
                'lvl2': '%s > %s > %s' % (category, subcategory, product_group)
            }
            record['categories'] = heirarchies

            # TODO: Business Relevance
            # star rating? purchase count? inventory status?

            # Create records for all variants
            for variant in variants:
                variant.update(record);
                data.append(variant)

    # Open a json writer, and use the json.dumps()
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

def camelCase(st):
    output = ''.join(x for x in st.title() if x.isalnum())
    return output[0].lower() + output[1:]

def snake_case(s):
    return ''.join(['_'+c.lower() if c.isupper() else c for c in s]).lstrip('_')

# Driver Code

# Decide the two file paths according to your
# computer system
csvFilePath = r'Backcountry_272937_datafeed.csv'
jsonFilePath = r'bc_distinct.json'

# Call the make_json function
make_json(csvFilePath, jsonFilePath)
