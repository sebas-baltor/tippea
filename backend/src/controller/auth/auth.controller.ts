// import { Request, Response } from 'express';

// export async function login(req: Request, res: Response): Promise<void> {
//   try {
//     const { username, password } = req.body;
//     const metadata = { ip: req.ip || '', userAgent: req.get('user-agent') || '' };

//     const user = await userRepository.findOne({ username });
//     if (!user) {
//       throw new BadRequestException('Credenciales inválidas');
//     }

//     const isPasswordCorrect = await comparePassword(password, user.password);
//     if (!isPasswordCorrect) {
//       throw new BadRequestException('Credenciales inválidas');
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken();

//     const refreshTokenMs = ms(asDurationString(config.REFRESH_TOKEN_TTL));
//     const expiresAt = new Date(Date.now() + refreshTokenMs);

//     await refreshTokenRepository.create({
//       userId: user._id,
//       token: refreshToken,
//       expiresAt,
//       ip: metadata.ip,
//       userAgent: metadata.userAgent
//     });

//     return {
//       accessToken,
//       refreshToken,
//     };
//   }
//     const { accessToken, refreshToken } = await authService.login(username, password, metadata);
//     const maxAge: number = 10000;

//     // res.cookie('refreshToken', refreshToken, {
//     //   httpOnly: true,
//     //   secure: config.NODE_ENV === 'production',
//     //   sameSite: 'strict',
//     //   maxAge,
//     // });
//     res.json({ accessToken });
//   } catch (error) {
//     console.log('error', error);
//     throw error;
//   }
// }

// // export async function logout(req: Request, res: Response): Promise<void> {
// //   try {
// //     const refreshToken = req.cookies.refreshToken;
// //     if (refreshToken) {
// //       await authService.logout(refreshToken);
// //     }
// //     res.clearCookie('refreshToken', {
// //       httpOnly: true,
// //       secure: config.NODE_ENV === 'production',
// //       sameSite: 'strict',
// //     });
// //     res.status(200).json({ message: 'Logged out successfully' });
// //   } catch (error) {
// //     throw error;
// //   }
// // }
