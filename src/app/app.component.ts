import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cifrador';
  
  // Propiedades del formulario
  nombre: string = '';
  clave: string = '';
  resultado: string = '';
  error: string = '';
  
  // Validaciones en tiempo real
  nombreError: string = '';
  claveError: string = '';

  // Función para cifrar usando el método Vigenère
  cifrarVigenere(): void {
    // Limpiar errores previos
    this.error = '';
    this.resultado = '';
    this.nombreError = '';
    this.claveError = '';

    // Validaciones
    if (!this.nombre.trim()) {
      this.error = 'Por favor ingresa un texto a cifrar';
      return;
    }

    if (!this.clave.trim()) {
      this.error = 'Por favor ingresa una clave para el cifrado';
      return;
    }

    // Validar que no contenga números
    if (this.contieneNumeros(this.nombre)) {
      this.nombreError = 'El texto no puede contener números';
      this.error = 'El texto a cifrar no puede contener números';
      return;
    }

    if (this.contieneNumeros(this.clave)) {
      this.claveError = 'La clave no puede contener números';
      this.error = 'La clave no puede contener números';
      return;
    }

    // Validar que contenga al menos una letra
    if (!this.contieneLetras(this.nombre)) {
      this.nombreError = 'El texto debe contener al menos una letra';
      this.error = 'El texto debe contener al menos una letra';
      return;
    }

    if (!this.contieneLetras(this.clave)) {
      this.claveError = 'La clave debe contener al menos una letra';
      this.error = 'La clave debe contener al menos una letra';
      return;
    }

    try {
      this.resultado = this.cifrarTexto(this.nombre, this.clave);
    } catch (err) {
      this.error = 'Error al cifrar el texto';
    }
  }

  // Algoritmo de cifrado Vigenère con alfabeto de 27 caracteres (incluyendo Ñ)
  private cifrarTexto(texto: string, clave: string): string {
    // Alfabeto español de 27 caracteres
    const alfabeto = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    
    const textoLimpio = texto.toUpperCase().replace(/[^A-ZÑ]/g, '');
    const claveLimpia = clave.toUpperCase().replace(/[^A-ZÑ]/g, '');
    
    if (claveLimpia.length === 0) {
      throw new Error('La clave debe contener al menos una letra');
    }

    let resultado = '';
    let indiceClave = 0;

    for (let i = 0; i < textoLimpio.length; i++) {
      const charTexto = textoLimpio[i];
      const charClave = claveLimpia[indiceClave % claveLimpia.length];
      
      // Obtener índices en el alfabeto de 27 caracteres
      const indiceTexto = alfabeto.indexOf(charTexto);
      const indiceClaveChar = alfabeto.indexOf(charClave);
      
      // Aplicar cifrado Vigenère: (texto + clave) mod 27
      const indiceCifrado = (indiceTexto + indiceClaveChar) % 27;
      
      // Convertir de vuelta a letra
      const charCifrado = alfabeto[indiceCifrado];
      resultado += charCifrado;
      
      indiceClave++;
    }

    return resultado;
  }

  // Función para limpiar el formulario
  limpiarFormulario(): void {
    this.nombre = '';
    this.clave = '';
    this.resultado = '';
    this.error = '';
    this.nombreError = '';
    this.claveError = '';
  }

  // Función para validar si contiene números
  private contieneNumeros(texto: string): boolean {
    return /\d/.test(texto);
  }

  // Función para validar si contiene letras (incluyendo Ñ)
  private contieneLetras(texto: string): boolean {
    return /[a-zA-ZÑñ]/.test(texto);
  }

  // Validación en tiempo real para el campo nombre
  onNombreChange(): void {
    this.nombreError = '';
    
    if (this.nombre && this.contieneNumeros(this.nombre)) {
      this.nombreError = 'El texto no puede contener números';
    }
    
    if (this.nombre && !this.contieneLetras(this.nombre)) {
      this.nombreError = 'El texto debe contener al menos una letra';
    }
  }

  // Validación en tiempo real para el campo clave
  onClaveChange(): void {
    this.claveError = '';
    
    if (this.clave && this.contieneNumeros(this.clave)) {
      this.claveError = 'La clave no puede contener números';
    }
    
    if (this.clave && !this.contieneLetras(this.clave)) {
      this.claveError = 'La clave debe contener al menos una letra';
    }
  }

  // Función para prevenir la entrada de números (permite letras incluyendo Ñ)
  onKeyPress(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.which);
    // Permitir letras (incluyendo Ñ), espacios, backspace, delete, etc.
    if (/\d/.test(char) && !/[a-zA-ZÑñ\s]/.test(char)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
