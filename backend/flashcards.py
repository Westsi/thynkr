from flask_restful import Resource
import os
import json
from app import FLASHCARDS_FOLDER
from app import api


class FlashCards(Resource):
    def get(self, identifier):
        file_path = FLASHCARDS_FOLDER + str(identifier) + '.json'
        f = open(file_path, 'r')
        data = f.read()
        data = json.loads(data)
        return data


class FlashCardsAll(Resource):
    def get(self):
        number_of_files = len(os.listdir(FLASHCARDS_FOLDER))
        data = []
        for i in range(number_of_files):
            file_path = FLASHCARDS_FOLDER + str(i + 1) + '.json'
            f = open(file_path, 'r')
            file = f.read()
            data.append(json.loads(file))
        return data

