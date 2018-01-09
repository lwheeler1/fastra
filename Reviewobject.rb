require 'sequel'

class Reviewobject < Sequel::Model
    many_to_one :users
    one_to_many :reviews
    many_to_one :schools 
    many_to_one :buildings 
end