To start the Project, run the following step-by-step in your command line or within PyCharm's terminal:
1. cd backend
2. virtualenv -p python3 ./venv
3. source ./venv/bin/activate
4. pip install -r requirements.txt
5. python main.py
==================================================================================================================

To rerun the project, execute: main.py

After the server is up & running, please navigate to the following page:
http://localhost:5000/d3_flask/

==================================================================================================================

This will bring us to the HOMEPAGE of the project with the following features:
1. Ability to view the high-dimensional dataset 'Spotify's Song attributes'.
2. Hover-over features on individual data points.
3. Histogram-aided visualization on Dimensional anchors.
4. Upload another file to visualize it in the Radviz visualization. As of now, this upload has been tested with 3 files:
    winequality-red.csv, iris.csv (The CSV files are present in the folder).
5. View bonus visualization - Parallel Coordinates.
6. Group Similar tracks and do exploratory data analysis.
7. Changing to one color.

==================================================================================================================

