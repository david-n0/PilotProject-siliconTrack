# 1. Koristimo zvanični PHP 8.2 image sa Apache web serverom
FROM php:8.2-apache

# Dozvoli Composeru da radi kao root u Dockeru
ENV COMPOSER_ALLOW_SUPERUSER=1

# 2. Instaliramo sistemske zavisnosti koje PHP ekstenzije trebaju
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libzip-dev \
    unzip \
    git \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# 3. Instaliramo PHP ekstenzije koje Symfony zahteva
RUN docker-php-ext-install \
    intl \
    pdo_mysql \
    zip \
    opcache

# 4. Instaliramo Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Radni direktorijum
WORKDIR /var/www/html

# 6. Kopiramo celu aplikaciju
COPY . .

# 7. Instaliramo čiste Linux PHP pakete bez pokretanja skripti tokom bilda
RUN composer install --no-dev --optimize-autoloader --no-scripts

# 8. Podešavamo Apache da sve rute automatski šalje na Symfony index.php (FallbackResource)
RUN echo '<VirtualHost *:8080>\n\
        DocumentRoot /var/www/html/public\n\
        <Directory /var/www/html/public>\n\
            AllowOverride None\n\
            Require all granted\n\
            FallbackResource /index.php\n\
        </Directory>\n\
        ErrorLog ${APACHE_LOG_DIR}/error.log\n\
        CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
    </VirtualHost>' > /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# 9. Kreiramo var i config/jwt foldere i dajemo Apache-u dozvole
RUN mkdir -p /var/www/html/var /var/www/html/config/jwt && \
    chown -R www-data:www-data /var/www/html/var /var/www/html/config/jwt

# 10. Cloud Run port 8080
EXPOSE 8080
RUN sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf
RUN sed -i 's/:80>/:8080>/' /etc/apache2/sites-available/000-default.conf

CMD ["apache2-foreground"]
