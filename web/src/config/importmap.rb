# Pin npm packages by running ./bin/importmap
pin "application", to: "application.js", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@rails/ujs", to: "https://ga.jspm.io/npm:@rails/ujs@6.1.4/lib/assets/compiled/rails-ujs.js", preload: true

## If you use Stimulus controllers, uncomment the following line and create app/javascript/controllers
# pin_all_from "app/javascript/controllers", under: "controllers"
