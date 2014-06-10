import requests
import time

sleep_time = 4

requests.get('http://localhost:1234/new_pos?lat=5.23&lng=5.1').text
print 'new_pos'
time.sleep(sleep_time)

requests.get('http://localhost:1234/new_pos?lat=6.23&lng=4.1').text
print 'new_pos'
time.sleep(sleep_time)

requests.get('http://localhost:1234/new_track?lat=7.23&lng=3.1&id=Me').text
print 'new_track'
time.sleep(sleep_time)

requests.get('http://localhost:1234/new_pos?lat=4.23&lng=3.1').text
print 'new_pos'
time.sleep(sleep_time)

requests.get('http://localhost:1234/new_pos?lat=4.23&lng=2.1').text
print 'new_pos'
time.sleep(sleep_time)

requests.get('http://localhost:1234/end_track').text
requests.get('http://localhost:1234/new_pos?lat=5.23&lng=2.1').text
print 'end_track'
