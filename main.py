from fastapi import FastAPI, Depends
from models import Product
from database import session
from database import engine
import databases_models
from sqlalchemy.orm import Session
from sqlalchemy.orm import Mapped, mapped_column
from fastapi.middleware.cors import CORSMiddleware





app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

database = databases_models.Base.metadata.create_all(bind=engine)
@app.get("/")
def yash():
    return {"message": "hello guys chai pelo"}

products = [Product(id=1, name="Phone", description="A smartphone", price=699.99, quantity=50),
    Product(id=2, name="Laptop", description="A powerful laptop", price=999.99, quantity=30),
    Product(id=3, name="Pen", description="A blue ink pen", price=1.99, quantity=100),
    Product(id=4, name="Table", description="A wooden table", price=199.99, quantity=20),
    Product(id=5, name="Chair", description="A comfortable chair", price=89.99, quantity=40)]
     
def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()  

def init_db():
    db = session()

    count = db.query(databases_models.Product).count()
    if count == 0:
        for product in products:
            db.add(databases_models.Product(**product.model_dump()))
        db.commit()      
init_db()

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    db_products = db.query(databases_models.Product).all()
    return db_products


@app.get("/products/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(databases_models.Product).filter(databases_models.Product.id == id).first()
    if db_product:
        return db_product
    return {"message": "Product not found"}

@app.post("/products")
def add_product(product: Product, db: Session = Depends(get_db)):
    db_product = databases_models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)  
    return db_product
@app.put("/products/{id}")
def update_product(id: int, product: Product, db: Session = Depends(get_db)):
    db_product = db.query(databases_models.Product).filter(databases_models.Product.id == id).first()
    if db_product:
        db_product.name = product.name # type: ignore
        db_product.description = product.description # type: ignore
        db_product.price = product.price # type: ignore
        db_product.quantity = product.quantity # type: ignore
        db.commit()
        return {"message": "Product updated"}
    return {"message": "Product not found"}

@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(databases_models.Product).filter(databases_models.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return {"message": "Product deleted"}
    return {"message": "Product not found"}