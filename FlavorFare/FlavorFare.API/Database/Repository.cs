﻿using FlavorFare.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FlavorFare.Data
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private FlavorFareDbContext _context;
        private DbSet<T> _table;

        public Repository(FlavorFareDbContext _context)
        {
            this._context = _context;
            _table = _context.Set<T>();
        }

        public IQueryable<T> FindAll()
            => _context.Set<T>();

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression)
            =>
            _context.Set<T>().Where(expression);

        public void Create(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            this._table.Add(entity);
            this._context.SaveChanges();
        }

        public void Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            this._table.Update(entity);
            this._context.SaveChanges();
        }

        public void Delete(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            this._table.Remove(entity);
            this._context.SaveChanges();
        }
    }
}