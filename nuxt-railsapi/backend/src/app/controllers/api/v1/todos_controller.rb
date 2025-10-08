class Api::V1::TodosController < ApplicationController
  #skip_before_action :doorkeeper_authorize!
  before_action :set_todo, only: [:show, :update, :destroy]

  # GET /api/v1/todos
  def index
    page = params[:page].present? ? params[:page].to_i : 1
    per_page = params[:count].present? ? params[:count].to_i : 20
    
    # PaginationServiceを使用してページネーション処理
    result = ::PaginationService.paginate(
      Todo.order(created_at: :desc),
      page: page,
      per_page: per_page
    )
    
    render json: {
      todos: TodoSerializer.serialize_collection(result[:data]),
      pagination: result[:pagination].to_hash
    }
  end

  # GET /api/v1/todos/:id
  def show
    render json: TodoSerializer.serialize(@todo)
  end

  # POST /api/v1/todos
  def create
    @todo = Todo.new(todo_params)
    
    if @todo.save
      render json: TodoSerializer.serialize(@todo), status: :created
    else
      render json: { errors: @todo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/todos/:id
  def update
    if @todo.update(todo_params)
      render json: TodoSerializer.serialize(@todo)
    else
      render json: { errors: @todo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/todos/:id
  def destroy
    @todo.destroy
    render json: { message: 'Todo deleted successfully' }
  end

  private

  def set_todo
    @todo = Todo.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Todo not found' }, status: :not_found
  end

  def todo_params
    params.permit(:title, :description, :completed)
  end
end
