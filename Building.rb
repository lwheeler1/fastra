require 'sequel'

class Building < Sequel::Model
    one_to_many :reviewobjects
    many_to_one :schools
end