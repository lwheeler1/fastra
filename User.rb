require 'sequel'

class User < Sequel::Model
    many_to_one :schools
    one_to_many :reviewobjects
    one_to_many :reviews
end