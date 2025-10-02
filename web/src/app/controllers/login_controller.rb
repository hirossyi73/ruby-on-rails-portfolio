class LoginController < ApplicationController
  skip_before_action :authenticate_user!
  #layout 'login' # ログイン専用レイアウト（オプション）
  
  def index
    # ログイン画面表示
    redirect_to root_path if user_signed_in?
  end
  
  def login
    user = User.find_by(email: params[:email]&.downcase&.strip)
    
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      
      # ログイン成功時のメッセージ
      flash[:notice] = "#{user.name}さん、おかえりなさい！"
      
      # リダイレクト先の指定（セッション保存されていた場合は元の場所へ）
      redirect_to session.delete(:return_to) || root_path
    else
      flash.now[:alert] = 'メールアドレスまたはパスワードが正しくありません'
      render :index, status: :unprocessable_entity
    end
  end
  
  def logout
    user_name = current_user&.name
    session[:user_id] = nil
    session.clear # セッション全体をクリア
    
    flash[:notice] = "#{user_name}さん、お疲れ様でした"
    redirect_to login_path
  end
end
