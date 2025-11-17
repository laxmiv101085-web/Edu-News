import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    // req.user is set by LocalAuthGuard after validation
    const payload = { sub: req.user.id, email: req.user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    };
  }
}

