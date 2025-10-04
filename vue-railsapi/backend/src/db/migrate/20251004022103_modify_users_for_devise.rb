class ModifyUsersForDevise < ActiveRecord::Migration[8.0]
  def change
    # password_digestからencrypted_passwordに変更
    remove_column :users, :password_digest, :string
    add_column :users, :encrypted_password, :string, null: false, default: ""
    
    # Devise用の追加カラム
    add_column :users, :reset_password_token, :string
    add_column :users, :reset_password_sent_at, :datetime
    add_column :users, :remember_created_at, :datetime
    
    # インデックス追加
    add_index :users, :reset_password_token, unique: true
  end
end
