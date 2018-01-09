require 'sequel'

class Review < Sequel::Model
    many_to_one :users
    one_to_many :reviewobjects
end