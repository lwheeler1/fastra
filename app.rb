# app.rb
require 'sinatra'
require 'sinatra/json'
require 'sequel'

class Reviewable < Sinatra::Base
  get '/' do
    File.read(File.join('public', 'index.html'))
  end

  configure do
    DB = Sequel.connect('sqlite://Reviewable_Database.db')    
    
          DB.create_table? :users do
            primary_key :usernameID
                String :username, :unique=>TRUE
                String :password
                String :firstName
                String :lastName
                String :email, :unique=>TRUE
                Int :schoolID
                String :admin             
              end

           DB.create_table? :schools do
             primary_key :schoolID
                 String :schoolName
                 String :schoolCoordinates        
                end

          DB.create_table? :buildings do
                    primary_key :buildingID
                        String :schoolID
                        String :name
                        Int :noOfFloors       
                        String :coordinates    
                  end

          DB.create_table? :reviewobjects do
                   primary_key :reviewablesID
                        String :username                       
                        String :reviewableName
                        String :reviewableDescription
                        String :category
                        String :subCategory
                        String :coordinates     
                        Int :schoolID
                      end

          DB.create_table? :reviews do
                   primary_key :reviewID
                        String :username
                        Int :reviewablesID
                        Int :rating
                        String :reviewText
                        Int :upvotesTotal
                        Int :downvotesTotal             
                      end               
        

        require_relative 'User'
        require_relative 'Review'
        require_relative 'School'
        require_relative 'Building'
        require_relative 'Reviewobject'

  end

#--------------------------------------------------------------- ReviewObject
post '/addReviewable' do
  puts "/addReviewable SUCCESS"

  payload = JSON.parse(request.body.read)

  reviewable = Reviewobject.create(:reviewableName => payload['Reviewable_name'], :coordinates => payload['latLong'], :username => payload['username'], :category => payload['category'], :subCategory => payload['subCategory'], :reviewableDescription => payload['reviewableDescription'], :schoolID => payload['school_id'])

  content_type :json
  { reviewableID: reviewable.reviewablesID }.to_json
end

#--------------------------------------------------------------- /getCategory
post '/getCategory' do
  
    puts "/getCategory SUCCESS"

  
    payload = JSON.parse(request.body.read)
  
    categoryList = Array.new()
  
    if Reviewobject.where(:schoolID => payload['school_id'], :category => payload['category']).empty? == false
  
      Reviewobject.where(:schoolID => payload['school_id'], :category => payload['category']).each do |object|

        hash = {:name => object.reviewableName, :coordinates => object.coordinates, :reviewableID => object.reviewablesID, :sub_category => object.subCategory, :reviewable_description => object.reviewableDescription}
      
        categoryList.push(hash)
  
      end
    end
  
    content_type :json
    { reviewables: categoryList }.to_json
  
  end
  

#--------------------------------------------------------------- Reviews
post '/getReviews' do

  puts "/getReviews SUCCESS"

  payload = JSON.parse(request.body.read)

  puts payload
  puts
  puts

  reviewList = Array.new()

  Review.where(:reviewablesID => payload['reviewableID']).each do |review|

    hash = {:username => review.username, :rating => review.rating, :up_votes => review.upvotesTotal, :down_votes => review.downvotesTotal, :review => review.reviewText, :reviewID => review.reviewID}

    reviewList.push(hash)

    end

     content_type :json
      { reviews: reviewList }.to_json

  end


post '/addReview' do

  puts "/addReview SUCESS"

  payload = JSON.parse(request.body.read)
  puts payload
  puts
  puts

  Review.create(:reviewablesID => payload['reviewableID'], :reviewText => payload['review'], :rating => payload['rating'], :username => payload['username'], :upvotesTotal => 0, :downvotesTotal => 0)

  content_type :json
  { add_review: "" }.to_json
  
end 

post '/editReview' do
  
  puts "/editReview SUCCESS"

  payload = JSON.parse(request.body.read)
  
  review = Review.where(:reviewID => payload['reviewID'])
  review.update(:reviewText => payload['reviewText'])
  review.update(:rating => payload['rating'])

  content_type :json
  { edit_review: "" }.to_json

end

post '/deleteReview' do

  puts "/deleteReview SUCCESS"
  
  payload = JSON.parse(request.body.read)  

  if Review.where(:reviewID => payload['reviewID']).empty? == false

    Review.where(:reviewID => payload['reviewID']).delete

  end

  content_type :json
  { delete_review: "" }.to_json

end
#--------------------------------------------------------------- /getUserReviews
post '/getUserReviews' do

  puts "/getUserReviews SUCCESS"

  payload = JSON.parse(request.body.read)

  userReviewList = Array.new()

  if Review.where(:username => payload['username']).empty? == false

    Review.where(:username => payload['username']).each do |review|

      hash = {:rating => review.rating, :up_votes => review.upvotesTotal, :down_votes => review.downvotesTotal, :review => review.reviewText, :reviewID => review.reviewID }

      userReviewList.push(hash)
    end

    content_type :json
    { reviews: userReviewList }.to_json
  end

end
#--------------------------------------------------------------- vote
post '/vote' do
  
    puts "/vote SUCCESS"
  
    payload = JSON.parse(request.body.read)
    puts payload
  
    if Review.where(:reviewID => payload['reviewID'].empty? == false)
      if payload['votetype'] > 0
        review = Review.where(:reviewID => payload['reviewID'])
        temp = review.get(:upvotesTotal)
        if temp == nil
          temp = 0
        end
        review.update(:upvotesTotal =>  temp + 1)

      else
        review = Review.where(:reviewID => payload['reviewID'])
        temp = review.get(:downvotesTotal)
        if temp == nil
          temp = 0
        end
        review = Review.where(:reviewID => payload['reviewID'])
        review.update(:downvotesTotal => temp + 1)   
      end
    end

    content_type :json
    { vote: "" }.to_json
  
  end

#--------------------------------------------------------------- User

post '/signUp' do
  
  puts "/signUp SUCESS"

  retVal = false

  payload = JSON.parse(request.body.read)

  if User.where(:username => payload['username']).empty? == true && User.where(:email => payload['email']).empty? == true


      User.create(:username => payload['username'], :password => payload['password'], :email => payload['email'], :firstName => payload['firstName'], :lastName => payload['lastName'], :schoolID => payload['schoolId'])

      retVal = true
  end


  content_type :json
      { signed_up: retVal }.to_json
      
  end

post '/signIn' do

  puts "/singIn SUCESS"

  payload = JSON.parse(request.body.read)

  schoolID = 0
  coordinates = ""
  retVal = false

  if User.where(:username => payload['username']).empty? == false && User.where(:username => payload['username']).get(:password) == payload['password']

    schoolID = User.where(:username => payload['username']).get(:schoolID)
    coordinates = School.where(:schoolID => schoolID).get(:schoolCoordinates)   
    retVal = true

    end

  content_type :json
      { signed_up: retVal, schoolID: schoolID, coordinates: coordinates  }.to_json

end

post '/updateUser' do

  puts "/updateUser SUCCESS"
  
  payload = JSON.parse(request.body.read)

  user = User.where(:username => payload['username'])

  if user.empty? == false
    if payload['email'] != ""
      user.update(:email => payload['email'])
    end

    if payload['password'] != ""
      user.update(:password => payload['password'])
    end

  end

  content_type :json
  { update_user: "" }.to_json
end

#--------------------------------------------------------------- School
post '/addSchool' do
  puts "/addSchool SUCCESS"
  
  payload = JSON.parse(request.body.read)

  puts payload

  school = School.create(:schoolName => payload['schoolName'], :schoolCoordinates => payload['schoolCoordinates'])

  content_type :json
  { schoolID: school.schoolID }.to_json

end

post '/getSchools' do
  puts "/getSchools"
  
  schoolList = Array.new()

  School.order(:schoolName).each do |school|

    hash = {:school_name => school.schoolName, :school_id => school.schoolID, :coordinates => school.schoolCoordinates}
    
    schoolList.push(hash)
  end

  content_type :json
  { schools: schoolList }.to_json

end

#--------------------------------------------------------------- Building
post '/addBuilding' do
  puts "/addBuilding SUCCESS"

  payload = JSON.parse(request.body.read)
  puts payload
  
  building = Building.create(:schoolID => payload['schoolID'], :name => payload['name'], :noOfFloors => payload['noOfFloors'], :coordinates => payload['coordinates'])

  content_type :json
  { buildingID: building.buildingID }.to_json
end

post '/getBuilding' do

  puts "/getBuilding SUCCESS"
  
  payload = JSON.parse(request.body.read)
  puts payload

  buildingList = Array.new()

  Building.where(:schoolID => payload['schoolID']).each do |building|
    
        hash = {:building_name => building.name, :building_id => building.buildingID, :noOfFloors => building.noOfFloors}
    
        buildingList.push(hash)
  end


  content_type :json
  { buildings: buildingList }.to_json

end
#--------------------------------------------------------------- Building
post '/getSingleSchool' do
  
  puts "/getSingleSchool SUCCESS"
  
  payload = JSON.parse(request.body.read)

  if School.where(:schoolID => payload['schoolID']).empty? == false

    school = School.where(:schoolID => payload['schoolID'])

  end

  content_type :json
  { schoolCoordinates: school.get(:schoolCoordinates) }.to_json

end

#--------------------------------------------------------------- Get Pins

# post '/getpins' do
  
#   puts "/getpins SUCESS"

#   payload = JSON.parse(request.body.read)

#   puts payload

#   returnVal = Array.new
#   #default no school DONE NOT TESTED
#     if (payload['category'] == nil && payload['sub_category'] == nil && payload['title'] == nil && payload['school_id'] == nil) 

        
#         Reviewableobject.where(:reviewablesID != nil).each do |row|
#          hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewablesName, :coordinates => row.coordinates}
#          returnVal.push(hash)
#         end

#       end

#       #all pins for a specified school specified DONE, NOT TESTED

#        if (payload['category'] == nil && payload['sub_category'] == nil && payload['title'] == nil && payload['school_id'] != nil) 
        
#         Reviewableobject.where(:school_id => payload['school_id']).each do |row|
#          hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewablesName, :coordinates => row.coordinates}
#          returnVal.push(hash)
#         end
#       end 
     
#     #if just category is checked and a category is chosen no school

#     if (payload['category'] != nil && payload['sub_category'] == nil && payload['title'] == nil && payload['school_id'] == nil) 
      
#       Reviewableobject.where(:category == payload['category']).each do |row|

#         hash = {:reviewblesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}
#         returnVal.push(hash)
#       end
#     end
   
#     #if just category is selected and school is specified 

#     if (payload['category'] =! nil && payload['sub_category'] == nil && payload['title'] == nil && payload['school_id'] != nil) 
  
#       Reviewableobject.where(:school_id == payload['school_id']).each do |row|
#        if(payload['category'] == row.category)  

#          hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}
#          returnVal.push(hash)
#         end
#       end
#     end
   
#     #if category and sub_category are selected and no school NOT TESTED

#     if (payload['category'] =! nil && payload['sub_category'] =! nil && payload['title'] == nil && payload['school_id'] == nil) 
      
#       Reviewableobject.where(:category== payload['category']).each do |row|
#        if(payload['sub_category'] == row.sub_category)  

#          hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}

#          returnVal.push(hash)
#         end
#       end
#     end

#     #if category and sub_category is selected and school is specified DONE, NOT TEST

#     if (payload['category'] =! nil && payload['sub_category'] =! nil && payload['title'] == nil && payload['school_id'] != nil) 
#       Reviewableobject.where(:school_id == payload['school_id']).each do |row|
#        if(payload['category'] == row.category)  
#         if(payload['sub_category'] == row.sub_category)

#          hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}
#          returnVal.push(hash)
#         end
#        end
#       end
#     end
     
#     #if category and sub_category is selected and a school isnt selected 

#     if (payload['category'] =! nil && payload['sub_category'] =! nil && payload['title'] == nil && payload['school_id'] == nil) 
#       Reviewableobject.where(:category== payload['category']).each do |row|
#         if(payload['sub_category'] == row.sub_category)  

#           hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}

#           returnVal.push(hash)
#         end
#       end
#     end
#     #if category and title is selected and a school isnt selected 

#     if (payload['category'] =! nil && payload['sub_category'] == nil && payload['title'] =! nil && payload['school_id'] == nil) 
      
#       Reviewableobject.where(:reviewName == (payload['title']) ).each do |row|
#        if(payload['category'] == row.category)  

#          hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}
 
#          returnVal.push(hash)
#         end
#       end
#     end

#       #if category and title is selected and school is specified DONE, NOT TEST

#     if (payload['category'] =! nil && payload['sub_category'] =! nil && payload['title'] == nil && payload['school_id'] != nil) 
#         Reviewableobject.where(:school_id == payload['school_id']).each do |row|
#          if(payload['title'] == row.reviewableName)  
#           if(payload['category'] == row.category)

#            hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}
  
#            returnVal.push(hash)
#           end
#          end
#        end
#       end
      

#         #if category, sub category, and title is selected and school is specified
#         if (payload['category'] =! nil && payload['sub_category'] =! nil && payload['title'] == nil && payload['school_id'] != nil) 
#           Reviewableobject.where(:school_id == payload['school_id']).each do |row|
#            if(payload['title'] == row.reviewableName)  
#             if(payload['category'] == row.category)
#               if(payload['sub_category'] == row.sub_category)

#                hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}
    
#                returnVal.push(hash)
#               end
#             end
#            end
#           end
#         end
        
#    #all pins for a title DONE, NOT TESTED

#    if (payload['category'] == nil && payload['sub_category'] == nil && payload['title'] == nil && payload['school_id'] != nil) 

    
#       Reviewableobject.where(:reviewableName => payload['title']).each do |row|
#         hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewablesName, :coordinates => row.coordinates}
#         returnVal.push(hash)
#       end
  
#     end
   
    
#  #if title and school NOT TESTED
#  if (payload['category'] =! nil && payload['sub_category'] =! nil && payload['title'] == nil && payload['school_id'] == nil)  
#   Reviewableobject.where(:reviewableName == payload['category']).each do |row|
#    if(payload['sub_category'] == row.sub_category)  

#       hash = {:reviewablesID => row.reviewableID, :reviewableName =>row.reviewableName, :coordinates => row.coordinates}

#        returnVal.push(hash)
#       end
#     end
#   end

#   content_type :json
#     { pins: returnVal }.to_json
# end


end
