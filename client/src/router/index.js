import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home"
import Register from "../views/Register"
import LogIn from "../views/LogIn"
import newCategory from "../views/Category/NewCategory"
import newProduct from "../views/Product/NewProduct"
import editProduct from "../views/Product/EditProduct"
import showProduct from "../views/Product/ShowProduct"
import showCategory from "../views/Category/ShowCategory"
import editCategory from "../views/Category/EditCategory"

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn
  },
  {
    path: '/category/new',
    component: newCategory
  },
  {
    path: '/category/edit/:category_id',
    component: editCategory
  },
  {
    path: '/category/show/:category_id',
    component: showCategory
  },
  {
    path: '/product/new',
    component: newProduct
  },
  {
    path: '/product/edit/:product_id',
    component: editProduct
  },
  {
    path: '/product/show/:product_id',
    component: showProduct
  },
];

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

// router.beforeEach((to, from, next) => {
//   if (to.name != 'showcourse' && to.name != 'login' && !store.state.isUserLoggedIn && to.name != 'home' && to.name != 'register') next({ name: 'login' });
//   else next();
// })


export default router;
