class Person
  include Mongoid::Document
  field :name, type: String
  field :dob, type: String
  field :dod, type: String
  field :gender, type: Integer
  field :parents, type: Array, default: []
  field :spouses, type: Array, default: []
  field :children, type: Array, default: []
  embedded_in :family, inverse_of: :people

  attr_accessible :name, :dob, :dod, :gender, :parents, :spouses, :children
end
