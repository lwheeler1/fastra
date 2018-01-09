require 'sequel'

class School < Sequel::Model
    one_to_many :reviewobjects
    one_to_many :users
    one_to_many :buildings
end