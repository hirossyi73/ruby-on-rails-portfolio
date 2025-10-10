-- railsユーザーに全権限を付与
GRANT ALL PRIVILEGES ON *.* TO 'rails'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- 必要なデータベースを作成
CREATE DATABASE IF NOT EXISTS nuxt_railsapi_development;
CREATE DATABASE IF NOT EXISTS nuxt_railsapi_test;

-- railsユーザーに対象データベースの権限を付与
GRANT ALL PRIVILEGES ON nuxt_railsapi_development.* TO 'rails'@'%';
GRANT ALL PRIVILEGES ON nuxt_railsapi_test.* TO 'rails'@'%';
FLUSH PRIVILEGES;
