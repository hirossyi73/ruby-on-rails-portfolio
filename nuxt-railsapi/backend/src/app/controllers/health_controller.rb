class HealthController < ApplicationController
  skip_before_action :doorkeeper_authorize!

  def check
    render json: { status: 'OK' }
  end
end
