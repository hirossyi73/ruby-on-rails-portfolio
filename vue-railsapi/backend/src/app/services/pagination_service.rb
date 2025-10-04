# ページネーションのロジックをカプセル化するサービスクラス
class PaginationService
  DEFAULT_PER_PAGE = 20
  MAX_PER_PAGE = 100

  attr_reader :current_page, :per_page, :total_count, :total_pages, :offset

  def initialize(page: 1, per_page: DEFAULT_PER_PAGE, total_count: 0)
    @current_page = [page.to_i, 1].max
    # per_pageが指定されていない場合はDEFAULT_PER_PAGEを使用
    per_page_value = per_page.to_i
    @per_page = per_page_value > 0 ? [per_page_value, MAX_PER_PAGE].min : DEFAULT_PER_PAGE
    @total_count = total_count.to_i
    @total_pages = (@total_count.to_f / @per_page).ceil
    @offset = (@current_page - 1) * @per_page
  end

  def has_next_page?
    current_page < total_pages
  end

  def has_prev_page?
    current_page > 1
  end

  def to_hash
    {
      current_page: current_page,
      per_page: per_page,
      total_count: total_count,
      total_pages: total_pages,
      has_next_page: has_next_page?,
      has_prev_page: has_prev_page?
    }
  end

  # ActiveRecordのリレーションに対してページネーションを適用
  def apply_to_relation(relation)
    relation.limit(per_page).offset(offset)
  end

  # クラスメソッドで簡単に使用できるようにする
  def self.paginate(relation, page: 1, per_page: DEFAULT_PER_PAGE)
    total_count = relation.count
    pagination = new(page: page, per_page: per_page, total_count: total_count)
    paginated_relation = pagination.apply_to_relation(relation)
    
    {
      data: paginated_relation,
      pagination: pagination
    }
  end
end
