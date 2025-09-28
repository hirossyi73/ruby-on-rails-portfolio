class TodosController < ApplicationController
  def index
    @todos = Todo.order(created_at: :desc)
  end

  def show
    @todo = Todo.find(params[:id])
  end

  def new
    @todo = Todo.new
  end

  def create
    @todo = Todo.new(todo_params)
    if @todo.save
      redirect_to root_path, notice: "Todoを作成しました。"
    else
      flash.now[:alert] = "Todoの作成に失敗しました。"
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @todo = Todo.find(params[:id])
  end

  def update
    @todo = Todo.find(params[:id])
    if @todo.update(todo_params)
      redirect_to root_path, notice: "Todoを更新しました。"
    else
      flash.now[:alert] = "Todoの更新に失敗しました。"
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @todo = Todo.find(params[:id])
    @todo.destroy
    redirect_to root_path, notice: "Todoを削除しました。"
  end

  protected

  def todo_params
    params.require(:todo).permit(:title, :completed)
  end
end
