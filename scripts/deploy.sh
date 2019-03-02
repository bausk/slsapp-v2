cd ./api
pipenv lock -r > requirements.txt
cd ..
python scripts/predeploy.py "$@"