class PeopleController < ApplicationController
  def index
    @family = Family.find(params[:family_id])
    @people = @family.people.all
  end

  def new
    @family = Family.find(params[:family_id])
    @person = @family.people.build
  end

  def create
    @family = Family.find(params[:family_id])
    relations = []

    if params[:person][:spouse]
      params[:person][:spouse].split(",").map do |r|
        relations << { relationship: "spouses", id: r, inverse: "spouses" }
      end
      params[:person].delete(:spouse)
    end

    if params[:person][:child]
      params[:person][:child].split(",").map do |r|
        relations << { relationship: "children", id: r, inverse: :parents }
      end
      params[:person].delete(:child)
    end

    if params[:person][:parent]
      params[:person][:parent].split(",").map do |r|
        relations << { relationship: "parents", id: r, inverse: :children }
      end
      params[:person].delete(:parent)
    end

    @person = @family.people.build(params[:person])

    puts relations
    if @person.valid?

      relations.each do |r|
        @relation = @family.people.find(r[:id])

        @relation.spouses
        @relation.children
        @relation.parents

        @person[r[:relationship]] << @relation.id
        @relation[r[:inverse]] << @person.id

        @relation.save!
      end

      @person.save!

      flash[:notice] = "Person added!"
      redirect_to family_path(@family)
      #render :js => "window.location.replace('#{family_path(@family)}');"
    else
      flash[:error] = "Problem adding person!"
      render :new
    end
  end

  def destroy
    @family = Family.find(params[:family_id])
    @person = @family.people.find(params[:id])

    @person.spouses && @person.spouses.each do |r|
      relation = @family.people.find(r)
      if relation.spouses
        relation.spouses.delete(@person.id)
        puts "hello"
        puts relation.spouses
        relation.save!
      end
    end

    @person.children && @person.children.each do |r|
      relation = @family.people.find(r)
      if relation.parents
        relation.parents.delete(@person.id)
        puts "hello"
        puts relation.parents
        relation.save!
      end
    end

    @person.parents && @person.parents.each do |r|
      relation = @family.people.find(r)
      if relation.children
        relation.children.delete(@person.id)
        puts "hello"
        puts relation.children
        relation.save!
      end
    end


    @person.delete
    redirect_to family_path(@family)

  end
end
