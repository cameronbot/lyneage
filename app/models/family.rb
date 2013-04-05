class Family
  include Mongoid::Document
  field :name, type: String
  embeds_many :people
  validates_presence_of :name
end
