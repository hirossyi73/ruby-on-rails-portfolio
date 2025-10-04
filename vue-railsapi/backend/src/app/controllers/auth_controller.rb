class AuthController < ApplicationController
  skip_before_action :doorkeeper_authorize!, only: [:token, :revoke]

  # POST /auth/token
  def token
    # Doorkeeper's token endpoint handles OAuth2 token generation
    # This endpoint is already provided by Doorkeeper routes
    render json: { error: 'Use /oauth/token endpoint' }, status: :method_not_allowed
  end

  # GET /auth/me
  def me
    render json: {
      id: current_user.id,
      name: current_user.name,
      email: current_user.email
    }
  end

  # POST /auth/revoke
  def revoke
    if doorkeeper_token
      doorkeeper_token.revoke
      render json: { message: 'Token revoked successfully' }
    else
      render json: { error: 'No token provided' }, status: :bad_request
    end
  end
end
