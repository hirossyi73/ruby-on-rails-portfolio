class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # CSRF protection
  protect_from_forgery with: :exception
  
  # Require authentication for all actions
  before_action :authenticate_user!
  
  private
  
  def authenticate_user!
    redirect_to login_path unless user_signed_in?
  end
  
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  rescue ActiveRecord::RecordNotFound
    session[:user_id] = nil
    nil
  end
  
  def user_signed_in?
    current_user.present?
  end
  
  helper_method :current_user, :user_signed_in?
end
