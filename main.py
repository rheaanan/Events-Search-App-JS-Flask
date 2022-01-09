# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]
from flask import Flask
from flask import request
from geolib import geohash
import requests



# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)

category_map = {'music':'KZFzniwnSyZfZ7v7nJ', 'sports':'KZFzniwnSyZfZ7v7nE', 'arts':'KZFzniwnSyZfZ7v7na', 'film': 'KZFzniwnSyZfZ7v7nn',
                'misc':'KZFzniwnSyZfZ7v7n1'}

@app.route('/xyz')
def mysite():
	search = requests.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=9y0GiDttpsVbJMpqziz7C4Z02gfnjOfN&keyword=AAAA&segmentId=KZFzniwnSyZfZ7v7nE&radius=10&unit=miles&geoPoint=9q5cs")
	#print(search.json())
	return {}

@app.route('/')
def index():
    return app.send_static_file('form.html')

@app.route("/form.css")
def css():
    return app.send_static_file('form.css')

@app.route("/search", methods =['GET'])
def call_ticketmasterapi():
    geohash_code = geohash.encode(request.args.get('lat'), request.args.get('lng'), 7)
    params = {
        'keyword': request.args.get('keyword').join("+"),
        'radius': request.args.get('distance'),
        'unit':'miles',
        'geoPoint': geohash_code
    }
    if request.args.get('category') != 'default':
        params['segmentId'] = category_map[request.args.get('category')]
    url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=9y0GiDttpsVbJMpqziz7C4Z02gfnjOfN"
    for key,value in params.items():
        url+="&"+key+"="+value
    #print("got geohash",geohash_code)
    #print("calling ticket master with url", url)
    returned_json = requests.get(url)
    #print("returned_json", returned_json.json())
    return(returned_json.json())

@app.route("/load", methods =['GET'])
def load_info():
    url = "https://app.ticketmaster.com/discovery/v2/events/"+request.args.get('id')+"?apikey=9y0GiDttpsVbJMpqziz7C4Z02gfnjOfN"
    #print("calling ticket master load_info with url", url)
    returned_json = requests.get(url)
    #print(returned_json.json())
    return (returned_json.json())
@app.route("/main.js")
def js():
    return app.send_static_file('main.js')


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
