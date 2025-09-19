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

  // Función para cifrar usando el método Vigenère
  cifrarVigenere(): void {
    // Limpiar errores previos
    this.error = '';
    this.resultado = '';

    // Validaciones
    if (!this.nombre.trim()) {
      this.error = 'Por favor ingresa un nombre o texto a cifrar';
      return;
    }

    if (!this.clave.trim()) {
      this.error = 'Por favor ingresa una clave para el cifrado';
      return;
    }

    try {
      this.resultado = this.cifrarTexto(this.nombre, this.clave);
    } catch (err) {
      this.error = 'Error al cifrar el texto';
    }
  }

  // Algoritmo de cifrado Vigenère
  private cifrarTexto(texto: string, clave: string): string {
    const textoLimpio = texto.toUpperCase().replace(/[^A-Z]/g, '');
    const claveLimpia = clave.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (claveLimpia.length === 0) {
      throw new Error('La clave debe contener al menos una letra');
    }

    let resultado = '';
    let indiceClave = 0;

    for (let i = 0; i < textoLimpio.length; i++) {
      const charTexto = textoLimpio[i];
      const charClave = claveLimpia[indiceClave % claveLimpia.length];
      
      // Convertir a números (A=0, B=1, ..., Z=25)
      const numTexto = charTexto.charCodeAt(0) - 65;
      const numClave = charClave.charCodeAt(0) - 65;
      
      // Aplicar cifrado Vigenère: (texto + clave) mod 26
      const numCifrado = (numTexto + numClave) % 26;
      
      // Convertir de vuelta a letra
      const charCifrado = String.fromCharCode(numCifrado + 65);
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
  }
}
