class ApplicationController < ActionController::API
  # Doorkeeper OAuth2 protection
  before_action :doorkeeper_authorize!

  protected

  # Get current user from Doorkeeper token
  def current_user
    @current_user ||= User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end

  # Render JSON error response
  def render_unauthorized(message = 'Unauthorized')
    render json: { error: message }, status: :unauthorized
  end

  # Skip authorization for certain actions (override in controllers)
  def skip_authorization?
    false
  end
end
