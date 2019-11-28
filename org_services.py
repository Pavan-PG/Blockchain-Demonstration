import requests
import json
import os
from twilio.rest import Client
account_sid = 'Your_Twilio_API'
auth_token = 'Your_Twilio_Auth_Token'
service_num = 0
client = Client(account_sid, auth_token)
loc_api_key = 'Your_Geo_Location_API'
send_url = "http://api.ipstack.com/check?access_key="+loc_api_key
geo_req = requests.get(send_url)
geo_json = json.loads(geo_req.text)
country_code = geo_json['country_code']
country_name = geo_json['country_name']
region_code = geo_json['region_code']
region_name = geo_json['region_name']
city = geo_json['city']
latitude = geo_json['latitude']
longitude = geo_json['longitude']
print("Welcome to the government service portal\n")
print("This portal will navigate you to the required services for rescue operations\n")
print("You are provided with various options below. Please select the appropriate service as per your requirement\n")
print("Number '1' helps you request for medical services\n")
print("Number '2' helps you request for food services\n")
print("Number '3' helps you request for transport and rescue operations\n")
service_num = int(input("Enter the appropriate number as per the service required : "))
message = "Country code : "+str(country_code)+"\nCountry name : "+str(country_name)+"\nRegion code : "+str(region_code)+"\nRegion name : "+str(region_name)+"\nCity : "+str(city)+"\nLatitude and longitude : ["+str(latitude)+","+str(longitude)+"]"
if(service_num==1):
	client.messages.create(from_='Your_Twilio_Number',to='Your_PhoneNumber',body="\nMedical emergency and these are the following details\n\n"+message)
elif(service_num==2):
	client.messages.create(from_='Your_Twilio_Number',to='Your_PhoneNumber',body="\nFood packets required and these are the following details\n\n"+message)
elif(service_num==3):
	client.messages.create(from_='Your_Twilio_Number',to='Your_PhoneNumber',body="\nRescue operations required immediately and these are the following details\n\n"+message)
print("\nYour response is recorded and will be serviced at the earliest")
