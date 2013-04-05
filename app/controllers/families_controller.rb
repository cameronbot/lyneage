class FamiliesController < ApplicationController
  def index
    @families = Family.all
  end

  def new
    @family = Family.new
  end

  def create
    @family = Family.new(params[:family])

    if @family.save!
      flash[:notice] = "Created family!"
      redirect_to family_path(@family)
    else
      flash[:alert] = "Problems creating family!"
      render :new
    end
  end

  def show
    @family = Family.find(params[:id])
    @person = Person.new
  end

  def d3data
    @family = Family.find(params[:id])
    people = @family.people

    @result = {}
    people.map do |p|
      @result[p.id] = {
        id: p.id,
        name: p.name,
        children: p.children,
        spouses: p.spouses,
        parents: p.parents
      }
    end

    render :json => @result
  end
end
