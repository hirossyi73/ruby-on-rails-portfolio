class User < ApplicationRecord
  has_secure_password
  
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  
  # 関連付け
  has_many :todos, dependent: :destroy
end
