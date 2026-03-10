from apps.tasks.model.category_model import Category


class CategoryRepository:
    @staticmethod
    def create(data) -> Category:
        return Category.objects.create(**data)

    @staticmethod
    def update(self, instance: Category, data: dict) -> Category:
        for attr, value in data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    @staticmethod
    def delete(instance: Category) -> None:
        instance.delete()

    @staticmethod
    def get_by_id(id: int) -> Category:
        return Category.objects.filter(id=id).first()

    @staticmethod
    def get_all():
        return Category.objects.all()
