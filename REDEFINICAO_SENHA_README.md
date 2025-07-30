# Funcionalidade de Redefinição de Senha

## Visão Geral

Esta funcionalidade permite que os usuários redefinam suas senhas através de um formulário seguro que valida o email e as senhas fornecidas.

## Características

### ✅ Validações Implementadas

1. **Email**:
   - Campo obrigatório
   - Formato de email válido

### 🎨 Interface do Usuário

- **Design Moderno**: Interface limpa com gradientes e animações suaves
- **Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop
- **Feedback Visual**: 
  - Indicador de força da senha em tempo real
  - Mensagens de erro específicas
  - Estados de loading durante o envio
  - Mensagens de sucesso/erro

### 🔒 Segurança

- **Validação em Tempo Real**: O campo é validado conforme o usuário digita
- **Prevenção de Submissão**: Botão desabilitado até que o formulário seja válido
- **Link Seguro**: O link de redefinição é enviado por email com token temporário

## Como Usar

### 1. Acessar a Página

Navegue para `/reset-password` no seu aplicativo.

### 2. Preencher o Formulário

1. **Email**: Digite o email da conta que deseja redefinir a senha

### 3. Enviar Solicitação

Clique no botão "Enviar Link de Redefinição" para receber o email de confirmação.

### 4. Verificar Email

Após o envio bem-sucedido, verifique sua caixa de entrada para o email de confirmação.

## Estrutura dos Arquivos

```
src/app/components/public/reset-password/
├── reset-password.html    # Template HTML
├── reset-password.ts      # Lógica do componente
└── reset-password.css     # Estilos CSS
```

## Integração com Backend

### Endpoint Necessário

O componente espera um endpoint POST em:
```
POST /api/v1/user/reset-password
```

### Payload de Requisição

```json
{
  "email": "usuario@exemplo.com"
}
```

### Resposta Esperada

**Sucesso:**
```
"Email enviado com sucesso!"
```

**Erro:**
```
"Qualquer outra mensagem será tratada como erro"
```

## Configuração do Backend

Para implementar no backend Spring Boot, você precisará:

1. **Controller**:
```java
@PostMapping("/reset-password")
public ResponseEntity<String> resetPassword(@RequestBody UserResetPasswordConfirmationRequest request) {
    // Lógica para enviar email de redefinição
    // Gerar token temporário
    // Enviar email com link de confirmação
    return ResponseEntity.ok("Email enviado com sucesso!");
}
```

2. **DTOs**:
```java
public record UserResetPasswordConfirmationRequest(
    @NotBlank(message = "O e-mail do usuário é obrigatório")
    @Email(message = "O e-mail informado não é válido")
    String email
) {
}
```

3. **Serviço de Email**:
```java
@Service
public class EmailService {
    public void sendResetPasswordEmail(String email, String token) {
        // Implementar envio de email
    }
}
```

## Estados da Interface

### Estados de Loading
- **Enviando**: Mostra spinner e texto "Enviando..."
- **Botão Desabilitado**: Durante o processo de envio

### Estados de Sucesso
- **Mensagem de Sucesso**: "Link de redefinição enviado com sucesso! Verifique sua caixa de entrada."
- **Redirecionamento**: Após 3 segundos, redireciona para `/login`

### Estados de Erro
- **Erro de Validação**: Mensagens específicas para cada campo
- **Erro de Servidor**: "Erro ao enviar email de confirmação. Tente novamente."

## Personalização

### Cores
As cores principais podem ser alteradas no CSS:
- **Primária**: `#667eea` (azul)
- **Secundária**: `#764ba2` (roxo)
- **Erro**: `#e74c3c` (vermelho)
- **Sucesso**: `#27ae60` (verde)

### Validações
As regras de validação podem ser modificadas no arquivo TypeScript:
- **Validação de email**: Linha 34

## Testes

### Cenários de Teste Recomendados

1. **Email Inválido**:
   - Email vazio
   - Formato de email incorreto
   - Email inexistente

2. **Fluxo Completo**:
   - Formulário válido
   - Envio bem-sucedido
   - Redirecionamento

## Dependências

- **Angular Forms**: ReactiveFormsModule
- **Angular Router**: RouterModule
- **Font Awesome**: Para ícones
- **CSS Gradients**: Para design moderno

## Suporte

Para dúvidas ou problemas com esta funcionalidade, consulte:
- Documentação do Angular Forms
- Guia de validação de senhas
- Documentação do Spring Boot (para backend) 