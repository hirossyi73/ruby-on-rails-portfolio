class TodosController < ApplicationController
  def index
    @todos = Todo.order(created_at: :desc)
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

  private

  def todo_params
    params.require(:todo).permit(:title, :completed)
  end
end
